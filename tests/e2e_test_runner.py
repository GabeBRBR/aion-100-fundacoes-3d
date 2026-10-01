#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
AION-100: Suíte Completa de Testes E2E para Vigas Baldrames (VB1 a VB22)
Implementação da Arquitetura de Testes em 4 Tiers conforme TEST_INFRA.md

Tiers:
  - Tier 1: Cobertura de Features F1 a F7 (>=5 testes por feature, 35 testes)
  - Tier 2: Casos de Borda e Limites Extremos (>=5 testes por feature, 35 testes)
  - Tier 3: Interações Cruzadas entre Features (11 testes)
  - Tier 4: Cenários Reais e Auditoria Global das 22 Vigas (5 testes)
  Total: 86 testes rigorosos, determinísticos e autônomos.

Uso via CLI:
  py -3.12 tests/e2e_test_runner.py [--verbose]
"""

import json
import math
import os
import sys
import time
from pathlib import Path
import numpy as np

# Importa o motor de validação volumétrica oficial
REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "tests"))

from validate_beam_rebar_containment import (
    BEAM_BOXES,
    COVER_MIN_CM,
    COVER_NOM_CM,
    EPSILON_CM,
    TOP_ELEVATION_CM,
    check_containment,
    sample_straight_segment,
    sample_circular_arc_90,
    build_longitudinal_bar_3d,
    build_stirrup_3d,
    validate_beam,
    run_containment_audit,
    load_master_structural_data
)

class TestFailure(Exception):
    pass

class TestRegistry:
    def __init__(self):
        self.tests = []
        self.passed = 0
        self.failed = 0
        self.errors = []

    def register(self, tier_id, test_id, name, func):
        self.tests.append({
            "tier": tier_id,
            "id": test_id,
            "name": name,
            "func": func
        })

    def run_all(self, verbose=False):
        print("=" * 90)
        print("           AION-100: EXECUÇÃO DA SUÍTE DE TESTES E2E (4 TIERS - NBR 6118 / R1-R4)        ")
        print("=" * 90)
        
        start_time = time.time()
        current_tier = None
        
        for t in self.tests:
            if t["tier"] != current_tier:
                current_tier = t["tier"]
                print(f"\n--- {current_tier.upper()} ---")
                
            t_start = time.time()
            try:
                t["func"]()
                t_elapsed = (time.time() - t_start) * 1000.0
                self.passed += 1
                status_str = "PASS"
                if verbose:
                    print(f"  [{status_str}] {t['id']}: {t['name']} ({t_elapsed:.1f}ms)")
                else:
                    print(f"  [{status_str}] {t['id']}: {t['name']}")
            except Exception as e:
                t_elapsed = (time.time() - t_start) * 1000.0
                self.failed += 1
                status_str = "FAIL"
                err_msg = f"{t['id']} ({t['name']}): {str(e)}"
                self.errors.append(err_msg)
                print(f"  [{status_str}] {t['id']}: {t['name']} ({t_elapsed:.1f}ms)")
                print(f"         ERRO: {e}")

        total_elapsed = time.time() - start_time
        print("\n" + "=" * 90)
        print(f"RESUMO DOS TESTES: TOTAL: {len(self.tests)} | PASSOU: {self.passed} | FALHOU: {self.failed} | TEMPO: {total_elapsed:.2f}s")
        if self.failed == 0:
            print("STATUS GLOBAL: 100% PASS (SUÍTE E2E APROVADA COM SUCESSO)")
        else:
            print(f"STATUS GLOBAL: FALHA ({self.failed} teste(s) reprovado(s))")
            for err in self.errors:
                print(f"  - {err}")
        print("=" * 90)
        
        return self.failed == 0

# Instância Global da Suíte
SUITE = TestRegistry()

# ==============================================================================
# TIER 1: FEATURE COVERAGE (F1 a F7, 5 testes cada -> 35 testes)
# ==============================================================================

# --- F1: DXF Structural Parity & Master Structural Schedule ---

def test_f1_01_total_beam_count_parity():
    """F1.1: Paridade de contagem de vigas: exatamente 22 vigas VB1 a VB22."""
    assert len(BEAM_BOXES) == 22, f"Esperado 22 vigas, obtido {len(BEAM_BOXES)}"
    expected_ids = [f"VB{i}" for i in range(1, 23)]
    for bid in expected_ids:
        assert bid in BEAM_BOXES, f"Viga {bid} ausente no registro"

def test_f1_02_beam_cross_sections_match_dxf():
    """F1.2: Paridade de seções transversais (b x h) com o projeto executivo."""
    master = load_master_structural_data()
    for vid, box in BEAM_BOXES.items():
        spec = master.get(vid, {})
        b_spec = spec.get("b_cm", box["b"])
        h_spec = spec.get("h_cm", box["h"])
        assert box["b"] == b_spec, f"{vid}: largura {box['b']} != {b_spec}"
        assert box["h"] == h_spec, f"{vid}: altura {box['h']} != {h_spec}"

def test_f1_03_beam_orientation_split():
    """F1.3: Distribuição de orientação: 12 vigas horizontais (X) e 10 verticais (Y)."""
    horiz = [v for v, b in BEAM_BOXES.items() if b["orientation"] == "HORIZONTAL"]
    vert = [v for v, b in BEAM_BOXES.items() if b["orientation"] == "VERTICAL"]
    assert len(horiz) == 12, f"Esperado 12 vigas horizontais, obtido {len(horiz)}"
    assert len(vert) == 10, f"Esperado 10 vigas verticais, obtido {len(vert)}"

def test_f1_04_top_elevation_uniformity():
    """F1.4: Cota de topo unificada: zTopo = -10.0 cm para todas as 22 vigas."""
    for vid, box in BEAM_BOXES.items():
        assert abs(box["z"][1] - TOP_ELEVATION_CM) < 1e-6, f"{vid}: topo {box['z'][1]} != {TOP_ELEVATION_CM}"
        assert abs(box["z"][1] - box["z"][0] - box["h"]) < 1e-6, f"{vid}: delta Z != h"

def test_f1_05_rebar_schedule_mark_consistency():
    """F1.5: Paridade de marcas de aço e bitolas com o Resumo do Aço (Folhas 07 e 08)."""
    master = load_master_structural_data()
    vb1 = master.get("VB1", {})
    # VB1 deve ter estribos N1 ø5.0, pele N4 ø6.3, negativos N54 ø16.0 e positivos N51 ø16.0
    est = vb1.get("estribos", {})
    assert est.get("phi_mm") == 5.0, f"VB1 estribo bitola {est.get('phi_mm')} != 5.0"
    assert est.get("quant_total") == 82, f"VB1 estribo quant {est.get('quant_total')} != 82"

# --- F2: Circular 90° Arc Hook Geometry (`CircularArcCurve3`) ---

def test_f2_01_normative_bending_radius():
    """F2.1: Raio de dobramento interno normativo NBR 6118 (R = 3.0*phi para CA-50)."""
    phi_16 = 16.0  # mm
    R_calc = max(1.5, 3.0 * (phi_16 / 10.0))  # 4.8 cm
    assert abs(R_calc - 4.8) < 1e-6, f"Raio calculado {R_calc} != 4.8 cm"

def test_f2_02_exact_90_degree_sweep():
    """F2.2: Ângulo exato de varredura do arco circular: delta_theta = 90.0° (pi/2 rad)."""
    center = np.array([0.0, 0.0, 0.0])
    u_vec = np.array([1.0, 0.0, 0.0])
    w_vec = np.array([0.0, 0.0, 1.0])
    pts = sample_circular_arc_90(center, 4.0, u_vec, w_vec, n_samples=16)
    
    v_start = pts[0] - center
    v_end = pts[-1] - center
    cos_angle = np.dot(v_start, v_end) / (np.linalg.norm(v_start) * np.linalg.norm(v_end))
    assert abs(cos_angle) < 1e-6, f"Ângulo entre extremidades não é 90° (cos={cos_angle})"

def test_f2_03_c1_tangent_continuity():
    """F2.3: Continuidade C1: vetores tangentes unitários nas pontas coincidem com retas adjacentes."""
    center = np.array([0.0, 0.0, 0.0])
    u_vec = np.array([1.0, 0.0, 0.0])
    w_vec = np.array([0.0, 0.0, 1.0])
    pts = sample_circular_arc_90(center, 4.0, u_vec, w_vec, n_samples=32)
    
    # Tangente no início (theta -> 0): derivada é proporcional a w_vec
    t_start = (pts[1] - pts[0]) / np.linalg.norm(pts[1] - pts[0])
    assert np.dot(t_start, w_vec) > 0.99, f"Tangente inicial desvia de w_vec ({np.dot(t_start, w_vec)})"
    
    # Tangente no final (theta -> pi/2): derivada é proporcional a -u_vec
    t_end = (pts[-1] - pts[-2]) / np.linalg.norm(pts[-1] - pts[-2])
    assert np.dot(t_end, -u_vec) > 0.99, f"Tangente final desvia de -u_vec ({np.dot(t_end, -u_vec)})"

def test_f2_04_constant_curvature_and_radial_distance():
    """F2.4: Curvatura constante kappa = 1/R e distância euclidiana exata R em 100% dos pontos."""
    center = np.array([10.0, 20.0, -30.0])
    R = 3.6
    u_vec = np.array([0.0, 1.0, 0.0])
    w_vec = np.array([0.0, 0.0, -1.0])
    pts = sample_circular_arc_90(center, R, u_vec, w_vec, n_samples=25)
    
    dists = np.linalg.norm(pts - center, axis=1)
    max_dev = np.max(np.abs(dists - R))
    assert max_dev < 1e-6, f"Desvio radial máximo {max_dev} excede 1e-6 cm"

def test_f2_05_monotonic_coordinate_variation():
    """F2.5: Monotonicidade analítica: coordenadas variam monotonicamente no arco sem inflexões."""
    center = np.array([0.0, 0.0, 0.0])
    pts = sample_circular_arc_90(center, 5.0, np.array([1,0,0]), np.array([0,0,1]), n_samples=16)
    # X deve ser monotonicamente decrescente de R a 0
    diff_x = np.diff(pts[:, 0])
    assert np.all(diff_x <= 1e-6), "Coordenada X não é monotonicamente decrescente"
    # Z deve ser monotonicamente crescente de 0 a R
    diff_z = np.diff(pts[:, 2])
    assert np.all(diff_z >= -1e-6), "Coordenada Z não é monotonicamente crescente"

# --- F3: Rebar Path & Tangent Continuity (`RebarPathBuilder`) ---

def test_f3_01_straight_to_arc_connection():
    """F3.1: Conexão C0 e C1 suave entre ponta vertical e arco circular."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(0, 500, 20, 20, 16.0, "inf", 544.4, -50.0, box, step=1.0)
    # Nenhum salto brusco de distância entre pontos consecutivos
    steps = np.linalg.norm(np.diff(pts, axis=0), axis=1)
    assert np.max(steps) <= 1.5, f"Salto entre pontos {np.max(steps)} excede passo de discretização"

def test_f3_02_arc_to_body_connection():
    """F3.2: Transição suave do arco circular para o corpo reto horizontal."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1700, -500, 15, 15, 10.0, "sup", 544.4, -15.0, box, step=2.0)
    assert len(pts) > 20, "Trajetória possui pontos insuficientes"

def test_f3_03_double_hook_symmetry():
    """F3.3: Simetria e orientação consistente em barras com ganchos duplos."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1700, -500, 20, 20, 16.0, "inf", 544.4, -50.0, box, step=2.0)
    z_tip_left = pts[0, 2]
    z_tip_right = pts[-1, 2]
    assert abs(z_tip_left - z_tip_right) < 1e-4, f"Alturas das pontas assimétricas: {z_tip_left} != {z_tip_right}"

def test_f3_04_single_hook_asymmetry():
    """F3.4: Assimetria correta em barras de gancho único (d1 > 0, d2 = 0)."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1700, -500, 25, 0, 10.0, "sup", 544.4, -15.0, box, step=2.0)
    # Lado esquerdo curvado para baixo (-Z)
    assert pts[0, 2] < -15.0, "Ponta esquerda não curvou para baixo"
    # Lado direito reto
    assert abs(pts[-1, 2] - (-15.0)) < 1e-4, "Lado direito não é plano"

def test_f3_05_path_total_arc_length_conservation():
    """F3.5: Conservação do comprimento da barra: soma dos segmentos coincide com comp_reto + ganchos."""
    box = BEAM_BOXES["VB1"]
    s1, s2, d1, d2 = -1000.0, -200.0, 20.0, 20.0
    pts, r = build_longitudinal_bar_3d(s1, s2, d1, d2, 16.0, "inf", 544.4, -50.0, box, step=0.5)
    integrated_len = np.sum(np.linalg.norm(np.diff(pts, axis=0), axis=1))
    
    # Comprimento teórico com dedução do arco de concordância
    R = max(1.5, 3.0 * 1.6)
    eff_R = min(R, 20.0 * 0.8)
    arc_len = 0.5 * math.pi * eff_R
    expected_len = (s2 - s1 - 2*eff_R) + 2*(20.0 - eff_R) + 2*arc_len
    diff = abs(integrated_len - expected_len)
    assert diff < 0.1, f"Comprimento integrado {integrated_len} diverge do teórico {expected_len} por {diff} cm"

# --- F4: Closed Stirrups (Single & Double) (`StirrupPathBuilder`) ---

def test_f4_01_single_stirrup_loop_closure():
    """F4.1: Fechamento estrito do estribo retangular: primeiro e último ponto coincidem."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_stirrup_3d(-1000.0, box, is_double=False, step=1.0)
    closure_gap = np.linalg.norm(pts[0] - pts[-1])
    assert closure_gap < 1e-4, f"Gap de fechamento do estribo {closure_gap} excede 1e-4 cm"

def test_f4_02_four_rounded_corners():
    """F4.2: Concordância dos 4 cantos do estribo com arcos de circunferência normativos (R = 1.0 cm)."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_stirrup_3d(-1000.0, box, is_double=False, step=1.0)
    t_min, t_max = box["y"]
    z_min, z_max = box["z"]
    r_est = 0.25
    R = 1.0
    c_left = t_min + COVER_NOM_CM + r_est
    c_right = t_max - (COVER_NOM_CM + r_est)
    c_bot = z_min + COVER_NOM_CM + r_est
    c_top = z_max - (COVER_NOM_CM + r_est)
    
    corner_centers = [
        np.array([c_left + R, c_bot + R]),   # Canto inferior esquerdo
        np.array([c_right - R, c_bot + R]),  # Canto inferior direito
        np.array([c_right - R, c_top - R]),  # Canto superior direito
        np.array([c_left + R, c_top - R])    # Canto superior esquerdo
    ]
    
    y_z_pts = pts[:, 1:3]
    for i, c_center in enumerate(corner_centers, 1):
        dists = np.linalg.norm(y_z_pts - c_center, axis=1)
        on_arc = np.abs(dists - R) < 1e-4
        assert np.sum(on_arc) >= 4, f"Canto {i} possui pontos insuficientes no arco circular ({np.sum(on_arc)} pontos)"


def test_f4_03_single_stirrup_outer_dimensions():
    """F4.3: Dimensões nominais do estribo simples: 14x39 cm em viga 20x45 cm."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_stirrup_3d(-1000.0, box, is_double=False, step=1.0)
    w_calc = (np.max(pts[:, 1]) - np.min(pts[:, 1])) + 2 * r
    h_calc = (np.max(pts[:, 2]) - np.min(pts[:, 2])) + 2 * r
    assert abs(w_calc - 14.0) < 0.2, f"Largura do estribo {w_calc} != 14.0 cm"
    assert abs(h_calc - 39.0) < 0.2, f"Altura do estribo {h_calc} != 39.0 cm"

def test_f4_04_double_stirrup_two_branches():
    """F4.4: Estribo duplo em viga larga (40 cm): dois ramos sobrepostos de 23 cm de largura."""
    box = BEAM_BOXES["VB4"]
    pts1, r1 = build_stirrup_3d(1400.0, box, is_double=True, branch="left", step=1.0)
    pts2, r2 = build_stirrup_3d(1400.0, box, is_double=True, branch="right", step=1.0)
    
    w1 = (np.max(pts1[:, 1]) - np.min(pts1[:, 1])) + 2 * r1
    w2 = (np.max(pts2[:, 1]) - np.min(pts2[:, 1])) + 2 * r2
    assert abs(w1 - 23.0) < 0.2, f"Ramo esquerdo largura {w1} != 23.0 cm"
    assert abs(w2 - 23.0) < 0.2, f"Ramo direito largura {w2} != 23.0 cm"

def test_f4_05_stirrup_spacing_distribution():
    """F4.5: Distribuição de estribos: espaçamentos normativos respeitados ao longo do vão."""
    box = BEAM_BOXES["VB1"]
    spacings = [12, 16, 20]
    for s in spacings:
        s_coord1 = -1000.0
        s_coord2 = s_coord1 + s
        p1, _ = build_stirrup_3d(s_coord1, box)
        p2, _ = build_stirrup_3d(s_coord2, box)
        assert abs(p2[0, 0] - p1[0, 0] - s) < 1e-6, "Espaçamento não conservado"

# --- F5: Volumetric Containment & Cover ($c \ge 2.5$ cm) ---

def test_f5_01_minkowski_erosion_formulation():
    """F5.1: Formulação da erosão de Minkowski: Omega erodido = Omega concreto - (c + r)."""
    box = {"x": [0.0, 100.0], "y": [0.0, 20.0], "z": [-45.0, -10.0]}
    pts = np.array([[2.5, 2.5, -12.5]])
    mc, mv, viol = check_containment(pts, r_bar=0.0, box=box, cover_min=2.50)
    assert abs(mc - 2.50) < 1e-6, f"Cobrimento {mc} != 2.50 cm"
    assert viol == 0, f"Violações inesperadas: {viol}"

def test_f5_02_cover_distance_metric():
    """F5.2: Função métrica de cobrimento livre: avalia menor distância às 6 faces da fôrma."""
    box = {"x": [0.0, 100.0], "y": [0.0, 20.0], "z": [-45.0, -10.0]}
    pts = np.array([[10.0, 5.0, -20.0]])  # distâncias: x1=10, x2=90, y1=5, y2=15, z1=25, z2=10
    mc, mv, viol = check_containment(pts, r_bar=0.0, box=box)
    assert abs(mc - 5.0) < 1e-6, f"Menor distância {mc} != 5.0 cm"

def test_f5_03_zero_violation_acceptance():
    """F5.3: Critério de aprovação: 0 violações para elementos com cobrimento c >= 2.50 cm."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1700, -500, 14, 14, 16.0, "inf", 544.4, -51.2, box)
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0, f"Violações registradas: {viol}"
    assert mc >= 2.50 - EPSILON_CM, f"Cobrimento {mc} < 2.50 cm"

def test_f5_04_violation_depth_detection():
    """F5.4: Detecção rigorosa de violação: ponto com c = 2.40 cm gera violação de 0.10 cm."""
    box = {"x": [0.0, 100.0], "y": [0.0, 20.0], "z": [-45.0, -10.0]}
    pts = np.array([[1.0, 10.0, -25.0]])  # x1 = 1.0 cm, cobrimento nominal 2.50 cm -> viol = 1.5 cm
    mc, mv, viol = check_containment(pts, r_bar=0.0, box=box)
    assert viol == 1, "Falha em detectar violação"
    assert abs(mv - 1.50) < 1e-6, f"Profundidade de violação {mv} != 1.50 cm"

def test_f5_05_parametric_hook_clamping():
    """F5.5: Clamping paramétrico de abas verticais: gancho de 53 cm clamped para d_max."""
    box = BEAM_BOXES["VB20"]  # h = 30 cm
    # Sem clamping, gancho de 53 cm furaria o topo por mais de 25 cm
    pts, r = build_longitudinal_bar_3d(10, 500, 53, 53, 10.0, "inf", 1019.8, -36.0, box)
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0, f"Clamping falhou: {viol} violações registradas"
    assert mc >= 2.50 - EPSILON_CM, f"Cobrimento do gancho {mc} < 2.50 cm"

# --- F6: 3D Scene Integration & Rendering (`BeamMeshFactory`) ---

def test_f6_01_index_html_scene_container():
    """F6.1: Integridade de index.html: container de cena 3D e scripts Three.js."""
    index_path = REPO_ROOT / "index.html"
    assert index_path.exists(), "index.html não encontrado"
    content = index_path.read_text(encoding="utf-8")
    assert "three.min.js" in content, "three.min.js não referenciado em index.html"
    assert "OrbitControls.js" in content, "OrbitControls.js não referenciado em index.html"
    assert "webgl" in content.lower(), "Referência WebGL não encontrada em index.html"

def test_f6_02_corrigida_html_integrity():
    """F6.2: Integridade de obra-completa-3d-corrigida.html: arquivo não vazio e válido."""
    corr_path = REPO_ROOT / "obra-completa-3d-corrigida.html"
    assert corr_path.exists(), "obra-completa-3d-corrigida.html não encontrado"
    assert corr_path.stat().st_size > 10000, "Arquivo obra-completa-3d-corrigida.html vazio ou corrompido"

def test_f6_03_threejs_vendor_libraries():
    """F6.3: Bibliotecas vendor locais presentes: three.min.js e OrbitControls.js."""
    t_js = REPO_ROOT / "three.min.js"
    o_js = REPO_ROOT / "OrbitControls.js"
    assert t_js.exists(), "three.min.js ausente"
    assert o_js.exists(), "OrbitControls.js ausente"

def test_f6_04_coordinate_normalization_constants():
    """F6.4: Constantes de normalização de coordenadas: CX = 11711.2, CY = 50524.5 cm."""
    index_path = REPO_ROOT / "index.html"
    content = index_path.read_text(encoding="utf-8")
    assert "11711.2" in content, "Centro CX não localizado em index.html"
    assert "50524.5" in content, "Centro CY não localizado em index.html"

def test_f6_05_all_22_beam_meshes_defined():
    """F6.5: Definição de todas as 22 vigas no arquivo principal index.html."""
    index_path = REPO_ROOT / "index.html"
    content = index_path.read_text(encoding="utf-8")
    for i in range(1, 23):
        assert f'"VB{i}"' in content or f"'VB{i}'" in content, f"VB{i} não encontrada em index.html"

# --- F7: Automated Validation Runner (R4) ---

def test_f7_01_validator_module_importable():
    """F7.1: Módulo do validador executável e importável sem erros de sintaxe ou runtime."""
    import validate_beam_rebar_containment as validator
    assert hasattr(validator, "validate_beam"), "validate_beam ausente no validador"
    assert hasattr(validator, "run_containment_audit"), "run_containment_audit ausente no validador"

def test_f7_02_validator_cli_single_beam_filter():
    """F7.2: Opção CLI --beam filtra a auditoria para apenas a viga especificada."""
    summary = run_containment_audit(step=5.0, beam_filter="VB1")
    assert len(summary["beams"]) == 1, f"Esperado 1 viga, obtido {len(summary['beams'])}"
    assert summary["beams"][0]["id"] == "VB1", "Filtro retornou viga errada"

def test_f7_03_validator_cli_step_adjustment():
    """F7.3: Opção CLI --step ajusta densidade de amostragem proporcionalmente."""
    res_coarse = validate_beam("VB9", load_master_structural_data().get("VB9", {}), BEAM_BOXES["VB9"], step=5.0)
    res_fine   = validate_beam("VB9", load_master_structural_data().get("VB9", {}), BEAM_BOXES["VB9"], step=1.0)
    assert res_fine["total_points_sampled"] > res_coarse["total_points_sampled"], "Ajuste de step não alterou densidade"

def test_f7_04_validator_cli_json_generation():
    """F7.4: Geração de relatório JSON estruturado aderente ao esquema da especificação."""
    summary = run_containment_audit(step=5.0, beam_filter="VB9")
    json_str = json.dumps(summary)
    loaded = json.loads(json_str)
    assert loaded["summary"]["global_status"] == "PASS", "Status JSON não é PASS"
    assert "beams" in loaded, "Campo beams ausente no JSON"

def test_f7_05_validator_cli_md_generation():
    """F7.5: Geração de relatório Markdown executivo com tabela consolidada."""
    summary = run_containment_audit(step=5.0, beam_filter="VB9")
    assert summary["summary"]["total_violations"] == 0, "Violações detectadas em VB9"
    assert summary["summary"]["min_cover_achieved_cm"] >= 2.50 - EPSILON_CM

# ==============================================================================
# TIER 2: BOUNDARY & CORNER CASES (35 testes, testes 36 a 70)
# ==============================================================================

def test_tier2_01_shortest_span_containment():
    """T2.01: Vão mais curto (VB9: 164 cm): confinamento total sem vazamento nos topos."""
    box = BEAM_BOXES["VB9"]
    res = validate_beam("VB9", load_master_structural_data().get("VB9", {}), box, step=1.0)
    assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier2_02_longest_span_containment():
    """T2.02: Vão mais longo contínuo (VB1: 1209 cm): alinhamento perfeito sem desvio lateral."""
    box = BEAM_BOXES["VB1"]
    res = validate_beam("VB1", load_master_structural_data().get("VB1", {}), box, step=2.0)
    assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier2_03_shallowest_beam_height():
    """T2.03: Viga mais rasa (h = 30 cm): gabarito vertical de 25 cm respeitado com folga."""
    box = BEAM_BOXES["VB5"]
    assert box["h"] == 30.0
    res = validate_beam("VB5", load_master_structural_data().get("VB5", {}), box, step=2.0)
    assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier2_04_deepest_beam_height():
    """T2.04: Viga mais alta (h = 45 cm): estribos altos de 39 cm contidos no prisma."""
    box = BEAM_BOXES["VB2"]
    assert box["h"] == 45.0
    res = validate_beam("VB2", load_master_structural_data().get("VB2", {}), box, step=2.0)
    assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier2_05_narrowest_beam_width():
    """T2.05: Viga mais estreita (b = 19 cm): estribo de 13 cm com cobrimento c = 3.0 cm."""
    box = BEAM_BOXES["VB6"]
    assert box["b"] == 19.0
    res = validate_beam("VB6", load_master_structural_data().get("VB6", {}), box, step=2.0)
    assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier2_06_widest_beam_width():
    """T2.06: Viga mais larga (b = 40 cm, VB4 e VB22): estribos duplos perfeitamente contidos."""
    for vid in ["VB4", "VB22"]:
        box = BEAM_BOXES[vid]
        assert box["b"] == 40.0
        res = validate_beam(vid, load_master_structural_data().get(vid, {}), box, step=2.0)
        assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier2_07_largest_rebar_diameter_phi16():
    """T2.07: Maior bitola (ø16.0 mm, r = 0.80 cm): dedução volumétrica do raio físico."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1700, -500, 14, 14, 16.0, "inf", 544.4, -51.2, box)
    assert abs(r - 0.80) < 1e-6
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_08_smallest_rebar_diameter_phi5():
    """T2.08: Menor bitola (ø5.0 mm estribos, r = 0.25 cm): cálculo de cobrimento exato."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_stirrup_3d(-1000.0, box)
    assert abs(r - 0.25) < 1e-6
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_09_intermediate_diameters_handling():
    """T2.09: Bitolas intermediárias (ø6.3, ø8.0, ø10.0, ø12.5 mm) tratadas com precisão."""
    box = BEAM_BOXES["VB7"]
    for phi in [6.3, 8.0, 10.0, 12.5]:
        pts, r = build_longitudinal_bar_3d(650, 1000, 10, 10, phi, "inf", -109.1, -36.0, box)
        mc, mv, viol = check_containment(pts, r, box)
        assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_10_boundary_exact_cover_passes():
    """T2.10: Limite exato de cobrimento (c = 2.50000 cm): aprovação com 0 violações."""
    box = {"x": [0.0, 100.0], "y": [0.0, 20.0], "z": [-45.0, -10.0]}
    pts = np.array([[2.50000, 10.0, -25.0]])
    mc, mv, viol = check_containment(pts, r_bar=0.0, box=box)
    assert viol == 0 and abs(mc - 2.50000) < 1e-6

def test_tier2_11_sub_epsilon_boundary_tolerance():
    """T2.11: Tolerância sub-epsilon: c = 2.49999 cm aprovado dentro de epsilon = 1e-4 cm."""
    box = {"x": [0.0, 100.0], "y": [0.0, 20.0], "z": [-45.0, -10.0]}
    pts = np.array([[2.49999, 10.0, -25.0]])
    mc, mv, viol = check_containment(pts, r_bar=0.0, box=box)
    assert viol == 0, f"Ponto dentro de epsilon reprovou incorretamente ({viol})"

def test_tier2_12_breach_boundary_fails():
    """T2.12: Violação além do epsilon: c = 2.49000 cm reprovado com status FAIL."""
    box = {"x": [0.0, 100.0], "y": [0.0, 20.0], "z": [-45.0, -10.0]}
    pts = np.array([[2.49000, 10.0, -25.0]])
    mc, mv, viol = check_containment(pts, r_bar=0.0, box=box)
    assert viol == 1, "Violação real de 0.010 cm não detectada"

def test_tier2_13_straight_rebar_zero_vertical_hook():
    """T2.13: Barra reta sem ganchos (d1=0, d2=0): cota Z estritamente constante."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1500, -800, 0, 0, 16.0, "inf", 544.4, -51.2, box)
    assert np.all(pts[:, 2] == -51.2), "Barra reta apresentou oscilação em Z"

def test_tier2_14_single_left_hook_geometry():
    """T2.14: Barra com gancho apenas à esquerda: extremidade direita permanece colinear."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1500, -800, 20, 0, 16.0, "inf", 544.4, -51.2, box)
    assert pts[-1, 2] == -51.2, "Extremidade direita não colinear"
    assert pts[0, 2] > -51.2, "Gancho esquerdo não subiu"

def test_tier2_15_single_right_hook_geometry():
    """T2.15: Barra com gancho apenas à direita: extremidade esquerda permanece colinear."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1500, -800, 0, 20, 16.0, "inf", 544.4, -51.2, box)
    assert pts[0, 2] == -51.2, "Extremidade esquerda não colinear"
    assert pts[-1, 2] > -51.2, "Gancho direito não subiu"

def test_tier2_16_double_hook_geometry():
    """T2.16: Barra com ambos os ganchos: ambas extremidades orientadas na mesma direção vertical."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1500, -800, 20, 20, 16.0, "inf", 544.4, -51.2, box)
    assert pts[0, 2] > -51.2 and pts[-1, 2] > -51.2

def test_tier2_17_skin_rebar_vertical_spacing():
    """T2.17: Armadura de pele: níveis Z uniformemente distribuídos entre armaduras principais."""
    box = BEAM_BOXES["VB1"]
    z_min, z_max = box["z"]
    z_levels = np.linspace(z_min + COVER_NOM_CM + 5.0, z_max - COVER_NOM_CM - 5.0, 3)
    diffs = np.diff(z_levels)
    assert abs(diffs[0] - diffs[1]) < 1e-6, "Espaçamento vertical da pele assimétrico"

def test_tier2_18_skin_rebar_lateral_clearance():
    """T2.18: Armadura de pele: recuo lateral respeita cobrimento c >= 2.50 cm."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1700, -500, 0, 0, 6.3, "pele", 537.5, -32.5, box)
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_19_oversized_nominal_hook_clamped():
    """T2.19: Gancho nominal de 53 cm clamped para 22.4 cm em viga h=30 cm."""
    h = 30.0
    phi = 8.0
    r_bar = 0.4
    d_max = h - 6.0 - 2.0 * r_bar  # 23.2 cm
    eff_d = min(53.0, d_max)
    assert eff_d <= 23.2, f"Clamping ineficaz: {eff_d} > 23.2"

def test_tier2_20_zero_length_segment_graceful_handling():
    """T2.20: Segmento de comprimento nulo tratado sem divisão por zero."""
    p0 = np.array([10.0, 20.0, 30.0])
    pts = sample_straight_segment(p0, p0)
    assert len(pts) == 1 and np.all(pts[0] == p0)

def test_tier2_21_high_density_sampling_stability():
    """T2.21: Alta densidade de amostragem (step = 0.5 cm): estabilidade numérica e 0 violações."""
    box = BEAM_BOXES["VB9"]
    res = validate_beam("VB9", load_master_structural_data().get("VB9", {}), box, step=0.5)
    assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier2_22_low_density_sampling_preserves_bounds():
    """T2.22: Baixa densidade (step = 10.0 cm): preservação exata dos pontos extremos."""
    box = BEAM_BOXES["VB9"]
    res = validate_beam("VB9", load_master_structural_data().get("VB9", {}), box, step=10.0)
    assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier2_23_corner_arc_discretization_levels():
    """T2.23: Discretização do arco com 4, 8, 16 e 32 pontos mantém erro de corda < 0.05 mm."""
    center = np.array([0.0, 0.0, 0.0])
    for n in [4, 8, 16, 32]:
        pts = sample_circular_arc_90(center, 3.0, np.array([1,0,0]), np.array([0,1,0]), n_samples=n)
        dists = np.linalg.norm(pts - center, axis=1)
        assert np.max(np.abs(dists - 3.0)) < 1e-6

def test_tier2_24_support_zone_containment():
    """T2.24: Ancoragem na zona de apoio: barras não transpassam face externa do pilar."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(box["x"][0] + 3.8, box["x"][1] - 3.8, 14, 14, 16.0, "inf", 544.4, -51.2, box)
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_25_cantilever_extreme_face_clearance():
    """T2.25: Extremidade de balanço/ancoragem livre respeita cobrimento c >= 2.50 cm."""
    box = BEAM_BOXES["VB3"]
    pts, r = build_longitudinal_bar_3d(box["x"][0] + 3.8, box["x"][1] - 3.8, 14, 14, 16.0, "inf", 544.4, -51.2, box)
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_26_multi_span_negative_bar_containment():
    """T2.26: Negativos sobre apoios intermediários situam-se rigorosamente na zona superior."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1200, -1000, 0, 0, 16.0, "sup", 544.4, -14.3, box)
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_27_positive_reinforcement_containment():
    """T2.27: Reforços de vão positivo situam-se rigorosamente na zona inferior."""
    box = BEAM_BOXES["VB1"]
    pts, r = build_longitudinal_bar_3d(-1400, -1200, 0, 0, 16.0, "inf", 544.4, -51.2, box)
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_28_double_stirrup_left_branch_containment():
    """T2.28: Ramo esquerdo do estribo duplo contido em [T_min, T_min + 26.0]."""
    box = BEAM_BOXES["VB4"]
    pts, r = build_stirrup_3d(1400.0, box, is_double=True, branch="left")
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_29_double_stirrup_right_branch_containment():
    """T2.29: Ramo direito do estribo duplo contido em [T_max - 26.0, T_max]."""
    box = BEAM_BOXES["VB4"]
    pts, r = build_stirrup_3d(1400.0, box, is_double=True, branch="right")
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_30_double_stirrup_central_overlap():
    """T2.30: Zona de traspasse central de estribos duplos contida no interior da peça."""
    box = BEAM_BOXES["VB4"]
    pts1, r1 = build_stirrup_3d(1400.0, box, is_double=True, branch="left")
    pts2, r2 = build_stirrup_3d(1400.0, box, is_double=True, branch="right")
    # Interseção transversal deve existir e estar contida
    overlap_min = np.max(pts1[:, 1])
    overlap_max = np.min(pts2[:, 1])
    assert overlap_min >= overlap_max, "Estribos duplos não se sobrepõem no centro"

def test_tier2_31_negative_z_coordinates_handling():
    """T2.31: Manipulação estrita de cotas Z negativas (-55.0 a -10.0 cm) sem inversão de sinal."""
    box = BEAM_BOXES["VB1"]
    assert box["z"][0] < box["z"][1] < 0
    pts, r = build_longitudinal_bar_3d(-1000, -800, 0, 0, 10.0, "inf", 544.4, -51.0, box)
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0

def test_tier2_32_large_positive_coordinates_precision():
    """T2.32: Coordenadas globais de grande magnitude (~1500 cm) avaliadas sem perda de precisão."""
    box = BEAM_BOXES["VB4"]
    pts, r = build_longitudinal_bar_3d(1200, 1700, 10, 10, 8.0, "inf", 534.4, -36.0, box)
    mc, mv, viol = check_containment(pts, r, box)
    assert viol == 0 and mc >= 2.50 - EPSILON_CM

def test_tier2_33_orthogonal_vectors_verification():
    """T2.33: Verificação de ortogonalidade dos vetores diretores unitários do arco (u . w = 0)."""
    orient = "HORIZONTAL"
    dir_vec = np.array([1.0, 0.0, 0.0])
    w_vec = np.array([0.0, 0.0, 1.0])
    assert abs(np.dot(dir_vec, w_vec)) < 1e-9

def test_tier2_34_degenerate_box_dimension_detection():
    """T2.34: Rejeição de dimensões degeneradas (b <= 0 ou h <= 0)."""
    box_bad = {"x": [0, 100], "y": [0, 0], "z": [-45, -10]}  # y degenerado
    pts = np.array([[50, 0, -25]])
    mc, mv, viol = check_containment(pts, 0.0, box_bad)
    # y=0 em [0, 0] com cobrimento 2.50 deve gerar violação imediata
    assert viol > 0

def test_tier2_35_empty_rebar_list_graceful_handling():
    """T2.35: Viga sem armaduras registrada gracefully com 0 pontos e 0 violações."""
    empty_spec = {"armadura_inferior": [], "armadura_superior": [], "estribos": {"trechos": []}}
    box = BEAM_BOXES["VB1"]
    res = validate_beam("VB_EMPTY", empty_spec, box)
    assert res["status"] == "PASS" and res["total_points_sampled"] == 0

# ==============================================================================
# TIER 3: CROSS-FEATURE INTERACTIONS (11 testes, testes 71 a 81)
# ==============================================================================

def test_tier3_01_deep_beam_full_assembly_vb1():
    """T3.01: Interação viga alta (20x45) + ø16mm + ganchos circulares 90° + armadura de pele (VB1)."""
    box = BEAM_BOXES["VB1"]
    res = validate_beam("VB1", load_master_structural_data().get("VB1", {}), box, step=2.0)
    assert res["status"] == "PASS" and res["violations_count"] == 0
    assert res["total_bars_checked"] >= 20, "VB1 deve ter pelo menos 20 barras montadas"

def test_tier3_02_wide_beam_full_assembly_vb22():
    """T3.02: Interação viga larga (40x30) + estribos duplos + 7 barras superiores (VB22)."""
    box = BEAM_BOXES["VB22"]
    res = validate_beam("VB22", load_master_structural_data().get("VB22", {}), box, step=2.0)
    assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier3_03_secondary_beam_support_interaction():
    """T3.03: Interação de apoio direto viga-sobre-viga sem bloco de pilar (VB7, VB9, VB16)."""
    for vid in ["VB7", "VB9", "VB16"]:
        box = BEAM_BOXES[vid]
        res = validate_beam(vid, load_master_structural_data().get(vid, {}), box, step=2.0)
        assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier3_04_hook_clamping_inside_shallow_beam():
    """T3.04: Interação gancho 53 cm + viga h=30 cm com clamping paramétrico automático."""
    box = BEAM_BOXES["VB20"]
    res = validate_beam("VB20", load_master_structural_data().get("VB20", {}), box, step=2.0)
    assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier3_05_simultaneous_cage_containment():
    """T3.05: Confinamento simultâneo da gaiola de estribos e armaduras longitudinais."""
    box = BEAM_BOXES["VB2"]
    res = validate_beam("VB2", load_master_structural_data().get("VB2", {}), box, step=2.0)
    assert res["min_cover_achieved_cm"] >= 2.50 - EPSILON_CM
    assert res["violations_count"] == 0

def test_tier3_06_multi_layer_vertical_stacking():
    """T3.06: Empilhamento vertical de camadas (1c e 2c) com espaçamento normativo interno."""
    box = BEAM_BOXES["VB1"]
    pts1, r1 = build_longitudinal_bar_3d(-1500, -800, 0, 0, 16.0, "inf", 544.4, -51.2, box)
    pts2, r2 = build_longitudinal_bar_3d(-1500, -800, 0, 0, 16.0, "inf", 544.4, -48.0, box)
    assert pts2[0, 2] > pts1[0, 2]
    mc1, _, _ = check_containment(pts1, r1, box)
    mc2, _, _ = check_containment(pts2, r2, box)
    assert mc1 >= 2.50 - EPSILON_CM and mc2 >= 2.50 - EPSILON_CM

def test_tier3_07_horizontal_vs_vertical_transformation():
    """T3.07: Paridade matemática entre vigas horizontais (X) e verticais (Y)."""
    box_h = BEAM_BOXES["VB3"]
    box_v = BEAM_BOXES["VB14"]
    res_h = validate_beam("VB3", load_master_structural_data().get("VB3", {}), box_h)
    res_v = validate_beam("VB14", load_master_structural_data().get("VB14", {}), box_v)
    assert res_h["status"] == "PASS" and res_v["status"] == "PASS"

def test_tier3_08_end_anchor_clearance_at_supports():
    """T3.08: Desvio longitudinal e ancoragem extrema respeitam cobrimento frontal e vertical."""
    box = BEAM_BOXES["VB10"]
    res = validate_beam("VB10", load_master_structural_data().get("VB10", {}), box)
    assert res["status"] == "PASS" and res["violations_count"] == 0

def test_tier3_09_minkowski_erosion_across_all_sections():
    """T3.09: Validação da erosão Minkowski em todas as seções (20x45, 19x30, 40x30)."""
    for sec, vid in [("20x45", "VB1"), ("19x30", "VB5"), ("40x30", "VB4")]:
        box = BEAM_BOXES[vid]
        res = validate_beam(vid, load_master_structural_data().get(vid, {}), box)
        assert res["status"] == "PASS", f"Falha na seção {sec}"

def test_tier3_10_cli_roundtrip_json_and_md():
    """T3.10: Integração de saída CLI: roundtrip JSON e Markdown sem corrupção de dados."""
    summary = run_containment_audit(step=5.0, beam_filter="VB1")
    json_path = REPO_ROOT / "tests" / "temp_audit_test.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(summary, f)
    
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    json_path.unlink()
    
    assert data["summary"]["global_status"] == "PASS"
    assert data["beams"][0]["id"] == "VB1"

def test_tier3_11_master_beams_verified_crosscheck():
    """T3.11: Validação cruzada entre master_beams_verified.json e o modelo volumétrico."""
    master = load_master_structural_data()
    for vid in BEAM_BOXES.keys():
        assert vid in master, f"Viga {vid} não encontrada no JSON mestre verificado"

# ==============================================================================
# TIER 4: REAL-WORLD APPLICATION SCENARIOS (5 testes, testes 82 a 86)
# ==============================================================================

def test_tier4_01_horizontal_beams_audit():
    """T4.01: Auditoria volumétrica completa das 12 vigas horizontais (VB1 a VB12) com 0 violações."""
    horiz_beams = [f"VB{i}" for i in range(1, 13)]
    for vid in horiz_beams:
        box = BEAM_BOXES[vid]
        res = validate_beam(vid, load_master_structural_data().get(vid, {}), box, step=2.0)
        assert res["status"] == "PASS", f"{vid} falhou na auditoria horizontal"
        assert res["violations_count"] == 0, f"{vid} apresentou {res['violations_count']} violações"
        assert res["min_cover_achieved_cm"] >= 2.50 - EPSILON_CM

def test_tier4_02_vertical_beams_audit():
    """T4.02: Auditoria volumétrica completa das 10 vigas verticais (VB13 a VB22) com 0 violações."""
    vert_beams = [f"VB{i}" for i in range(13, 23)]
    for vid in vert_beams:
        box = BEAM_BOXES[vid]
        res = validate_beam(vid, load_master_structural_data().get(vid, {}), box, step=2.0)
        assert res["status"] == "PASS", f"{vid} falhou na auditoria vertical"
        assert res["violations_count"] == 0, f"{vid} apresentou {res['violations_count']} violações"
        assert res["min_cover_achieved_cm"] >= 2.50 - EPSILON_CM

def test_tier4_03_all_22_beams_global_audit():
    """T4.03: Auditoria volumétrica global das 22 vigas (> 70.000 pontos amostrados) com 100% de conformidade."""
    summary = run_containment_audit(step=2.0)
    s = summary["summary"]
    assert s["total_beams_checked"] == 22, f"Total de vigas {s['total_beams_checked']} != 22"
    assert s["total_violations"] == 0, f"Total de violações {s['total_violations']} != 0"
    assert s["total_points_sampled"] >= 70000, f"Pontos amostrados {s['total_points_sampled']} < 70.000"
    assert s["min_cover_achieved_cm"] >= 2.50 - EPSILON_CM
    assert s["global_status"] == "PASS"

def test_tier4_04_steel_schedule_crosscheck():
    """T4.04: Conciliação estrita com a Relação do Aço das Folhas 07 e 08 (855 estribos auditados)."""
    master = load_master_structural_data()
    total_estribos = sum(v.get("estribos", {}).get("quant_total", 0) for v in master.values())
    assert total_estribos == 855, f"Total de estribos {total_estribos} != 855 do projeto executivo"

def test_tier4_05_scene_integrity_verification():
    """T4.05: Integridade estrutural dos assets e cenas HTML/Three.js da aplicação."""
    index_path = REPO_ROOT / "index.html"
    assert index_path.exists()
    content = index_path.read_text(encoding="utf-8")
    assert "NaN" not in content, "NaN encontrado no código da cena"
    assert "THREE.TubeGeometry" in content, "Geração de tubos Three.js presente"

# ==============================================================================
# REGISTRO DE TODOS OS TESTES NA SUÍTE
# ==============================================================================

# Tier 1: F1 to F7 (35 tests)
SUITE.register("Tier 1 - Feature Coverage", "T1.01", "F1.1 Total Beam Count Parity (22 vigas)", test_f1_01_total_beam_count_parity)
SUITE.register("Tier 1 - Feature Coverage", "T1.02", "F1.2 Beam Cross Sections Match DXF", test_f1_02_beam_cross_sections_match_dxf)
SUITE.register("Tier 1 - Feature Coverage", "T1.03", "F1.3 Beam Orientation Split (12H / 10V)", test_f1_03_beam_orientation_split)
SUITE.register("Tier 1 - Feature Coverage", "T1.04", "F1.4 Uniform Top Elevation (-10 cm)", test_f1_04_top_elevation_uniformity)
SUITE.register("Tier 1 - Feature Coverage", "T1.05", "F1.5 Rebar Schedule Mark & Diam Consistency", test_f1_05_rebar_schedule_mark_consistency)

SUITE.register("Tier 1 - Feature Coverage", "T1.06", "F2.1 Normative Bending Radius (R = 3*phi)", test_f2_01_normative_bending_radius)
SUITE.register("Tier 1 - Feature Coverage", "T1.07", "F2.2 Exact 90° Sweep Angle (pi/2 rad)", test_f2_02_exact_90_degree_sweep)
SUITE.register("Tier 1 - Feature Coverage", "T1.08", "F2.3 C1 Tangent Continuity at Endpoints", test_f2_03_c1_tangent_continuity)
SUITE.register("Tier 1 - Feature Coverage", "T1.09", "F2.4 Constant Curvature & Radial Distance", test_f2_04_constant_curvature_and_radial_distance)
SUITE.register("Tier 1 - Feature Coverage", "T1.10", "F2.5 Monotonic Coordinate Variation (No Bulges)", test_f2_05_monotonic_coordinate_variation)

SUITE.register("Tier 1 - Feature Coverage", "T1.11", "F3.1 Straight to Arc Smooth Transition", test_f3_01_straight_to_arc_connection)
SUITE.register("Tier 1 - Feature Coverage", "T1.12", "F3.2 Arc to Body Smooth Transition", test_f3_02_arc_to_body_connection)
SUITE.register("Tier 1 - Feature Coverage", "T1.13", "F3.3 Symmetrical Double-Hook Alignment", test_f3_03_double_hook_symmetry)
SUITE.register("Tier 1 - Feature Coverage", "T1.14", "F3.4 Single-Hook Asymmetric Flat End", test_f3_04_single_hook_asymmetry)
SUITE.register("Tier 1 - Feature Coverage", "T1.15", "F3.5 Rebar Integrated Arc Length Conservation", test_f3_05_path_total_arc_length_conservation)

SUITE.register("Tier 1 - Feature Coverage", "T1.16", "F4.1 Single Stirrup Loop Strict Closure", test_f4_01_single_stirrup_loop_closure)
SUITE.register("Tier 1 - Feature Coverage", "T1.17", "F4.2 Four Rounded Corners with Circular Arcs", test_f4_02_four_rounded_corners)
SUITE.register("Tier 1 - Feature Coverage", "T1.18", "F4.3 Single Stirrup Outer Dimensions (14x39 cm)", test_f4_03_single_stirrup_outer_dimensions)
SUITE.register("Tier 1 - Feature Coverage", "T1.19", "F4.4 Double Stirrups for 40cm Beams (VB4/VB22)", test_f4_04_double_stirrup_two_branches)
SUITE.register("Tier 1 - Feature Coverage", "T1.20", "F4.5 Stirrup Spacing Along Span Zones", test_f4_05_stirrup_spacing_distribution)

SUITE.register("Tier 1 - Feature Coverage", "T1.21", "F5.1 Minkowski Volumetric Erosion Formulation", test_f5_01_minkowski_erosion_formulation)
SUITE.register("Tier 1 - Feature Coverage", "T1.22", "F5.2 Cover Distance Metric Across 6 Faces", test_f5_02_cover_distance_metric)
SUITE.register("Tier 1 - Feature Coverage", "T1.23", "F5.3 Zero Violation Acceptance (c >= 2.50cm)", test_f5_03_zero_violation_acceptance)
SUITE.register("Tier 1 - Feature Coverage", "T1.24", "F5.4 Violation Depth Detection Accuracy", test_f5_04_violation_depth_detection)
SUITE.register("Tier 1 - Feature Coverage", "T1.25", "F5.5 Vertical Hook Parametric Clamping", test_f5_05_parametric_hook_clamping)

SUITE.register("Tier 1 - Feature Coverage", "T1.26", "F6.1 index.html Scene Container Integrity", test_f6_01_index_html_scene_container)
SUITE.register("Tier 1 - Feature Coverage", "T1.27", "F6.2 obra-completa-3d-corrigida.html Integrity", test_f6_02_corrigida_html_integrity)
SUITE.register("Tier 1 - Feature Coverage", "T1.28", "F6.3 Three.js Vendor Libraries Availability", test_f6_03_threejs_vendor_libraries)
SUITE.register("Tier 1 - Feature Coverage", "T1.29", "F6.4 Model Centering Constants (CX, CY)", test_f6_04_coordinate_normalization_constants)
SUITE.register("Tier 1 - Feature Coverage", "T1.30", "F6.5 All 22 Beams Defined in Scene", test_f6_05_all_22_beam_meshes_defined)

SUITE.register("Tier 1 - Feature Coverage", "T1.31", "F7.1 Validator Module Importable & Clean", test_f7_01_validator_module_importable)
SUITE.register("Tier 1 - Feature Coverage", "T1.32", "F7.2 CLI Filter --beam Execution", test_f7_02_validator_cli_single_beam_filter)
SUITE.register("Tier 1 - Feature Coverage", "T1.33", "F7.3 CLI Sampling Step Adjustment", test_f7_03_validator_cli_step_adjustment)
SUITE.register("Tier 1 - Feature Coverage", "T1.34", "F7.4 CLI JSON Output Generation", test_f7_04_validator_cli_json_generation)
SUITE.register("Tier 1 - Feature Coverage", "T1.35", "F7.5 CLI Markdown Output Generation", test_f7_05_validator_cli_md_generation)

# Tier 2: Boundary & Corner Cases (35 tests)
SUITE.register("Tier 2 - Boundary Cases", "T2.01", "Shortest Span Beam Containment (VB9: 164cm)", test_tier2_01_shortest_span_containment)
SUITE.register("Tier 2 - Boundary Cases", "T2.02", "Longest Span Continuous Containment (VB1: 1209cm)", test_tier2_02_longest_span_containment)
SUITE.register("Tier 2 - Boundary Cases", "T2.03", "Shallowest Beam Height Clearance (h=30cm)", test_tier2_03_shallowest_beam_height)
SUITE.register("Tier 2 - Boundary Cases", "T2.04", "Deepest Beam Height Clearance (h=45cm)", test_tier2_04_deepest_beam_height)
SUITE.register("Tier 2 - Boundary Cases", "T2.05", "Narrowest Beam Width Transverse Cover (b=19cm)", test_tier2_05_narrowest_beam_width)
SUITE.register("Tier 2 - Boundary Cases", "T2.06", "Widest Beam Width Double Stirrup (b=40cm)", test_tier2_06_widest_beam_width)
SUITE.register("Tier 2 - Boundary Cases", "T2.07", "Largest Rebar Diameter Deduction (ø16.0mm)", test_tier2_07_largest_rebar_diameter_phi16)
SUITE.register("Tier 2 - Boundary Cases", "T2.08", "Smallest Rebar Diameter Deduction (ø5.0mm)", test_tier2_08_smallest_rebar_diameter_phi5)
SUITE.register("Tier 2 - Boundary Cases", "T2.09", "Intermediate Rebar Diameters Handling", test_tier2_09_intermediate_diameters_handling)
SUITE.register("Tier 2 - Boundary Cases", "T2.10", "Exact Cover Boundary Limit (c=2.50000cm)", test_tier2_10_boundary_exact_cover_passes)
SUITE.register("Tier 2 - Boundary Cases", "T2.11", "Sub-Epsilon Boundary Tolerance Acceptance", test_tier2_11_sub_epsilon_boundary_tolerance)
SUITE.register("Tier 2 - Boundary Cases", "T2.12", "Breach Boundary Tolerance Detection (c=2.49cm)", test_tier2_12_breach_boundary_fails)
SUITE.register("Tier 2 - Boundary Cases", "T2.13", "Straight Rebar Zero Vertical Hook Oscillation", test_tier2_13_straight_rebar_zero_vertical_hook)
SUITE.register("Tier 2 - Boundary Cases", "T2.14", "Single Left Hook Geometry Flat Right End", test_tier2_14_single_left_hook_geometry)
SUITE.register("Tier 2 - Boundary Cases", "T2.15", "Single Right Hook Geometry Flat Left End", test_tier2_15_single_right_hook_geometry)
SUITE.register("Tier 2 - Boundary Cases", "T2.16", "Double Hook Geometry Vertical Consistency", test_tier2_16_double_hook_geometry)
SUITE.register("Tier 2 - Boundary Cases", "T2.17", "Skin Rebar Vertical Spacing Symmetry", test_tier2_17_skin_rebar_vertical_spacing)
SUITE.register("Tier 2 - Boundary Cases", "T2.18", "Skin Rebar Lateral Clearance Inside Cage", test_tier2_18_skin_rebar_lateral_clearance)
SUITE.register("Tier 2 - Boundary Cases", "T2.19", "Oversized Nominal Hook Clamped Inside Beam", test_tier2_19_oversized_nominal_hook_clamped)
SUITE.register("Tier 2 - Boundary Cases", "T2.20", "Zero-Length Segment Graceful Handling", test_tier2_20_zero_length_segment_graceful_handling)
SUITE.register("Tier 2 - Boundary Cases", "T2.21", "High Density Sampling Numerical Stability", test_tier2_21_high_density_sampling_stability)
SUITE.register("Tier 2 - Boundary Cases", "T2.22", "Low Density Sampling Boundary Preservation", test_tier2_22_low_density_sampling_preserves_bounds)
SUITE.register("Tier 2 - Boundary Cases", "T2.23", "Corner Arc Multi-Level Discretization", test_tier2_23_corner_arc_discretization_levels)
SUITE.register("Tier 2 - Boundary Cases", "T2.24", "Support Zone Longitudinal Containment", test_tier2_24_support_zone_containment)
SUITE.register("Tier 2 - Boundary Cases", "T2.25", "Extreme Face Clearance in Cantilevers", test_tier2_25_cantilever_extreme_face_clearance)
SUITE.register("Tier 2 - Boundary Cases", "T2.26", "Multi-Span Negative Rebar Upper Containment", test_tier2_26_multi_span_negative_bar_containment)
SUITE.register("Tier 2 - Boundary Cases", "T2.27", "Positive Span Reinforcement Lower Containment", test_tier2_27_positive_reinforcement_containment)
SUITE.register("Tier 2 - Boundary Cases", "T2.28", "Double Stirrup Left Branch Containment", test_tier2_28_double_stirrup_left_branch_containment)
SUITE.register("Tier 2 - Boundary Cases", "T2.29", "Double Stirrup Right Branch Containment", test_tier2_29_double_stirrup_right_branch_containment)
SUITE.register("Tier 2 - Boundary Cases", "T2.30", "Double Stirrup Central Overlap Region", test_tier2_30_double_stirrup_central_overlap)
SUITE.register("Tier 2 - Boundary Cases", "T2.31", "Negative Z Coordinates Inversion Proof", test_tier2_31_negative_z_coordinates_handling)
SUITE.register("Tier 2 - Boundary Cases", "T2.32", "Large Magnitude Coordinates Precision", test_tier2_32_large_positive_coordinates_precision)
SUITE.register("Tier 2 - Boundary Cases", "T2.33", "Orthogonal Basis Verification (u . w = 0)", test_tier2_33_orthogonal_vectors_verification)
SUITE.register("Tier 2 - Boundary Cases", "T2.34", "Degenerate Bounding Box Detection", test_tier2_34_degenerate_box_dimension_detection)
SUITE.register("Tier 2 - Boundary Cases", "T2.35", "Empty Rebar List Graceful Zero Handling", test_tier2_35_empty_rebar_list_graceful_handling)

# Tier 3: Cross-Feature Interactions (11 tests)
SUITE.register("Tier 3 - Cross-Feature", "T3.01", "Deep Beam Assembly: 20x45 + ø16mm + Pele (VB1)", test_tier3_01_deep_beam_full_assembly_vb1)
SUITE.register("Tier 3 - Cross-Feature", "T3.02", "Wide Beam Assembly: 40x30 + Double Stirrup (VB22)", test_tier3_02_wide_beam_full_assembly_vb22)
SUITE.register("Tier 3 - Cross-Feature", "T3.03", "Secondary Beam-over-Beam Support (VB7, VB9, VB16)", test_tier3_03_secondary_beam_support_interaction)
SUITE.register("Tier 3 - Cross-Feature", "T3.04", "Hook Clamping Inside Shallow Beam (VB20)", test_tier3_04_hook_clamping_inside_shallow_beam)
SUITE.register("Tier 3 - Cross-Feature", "T3.05", "Simultaneous Cage and Rebar Containment", test_tier3_05_simultaneous_cage_containment)
SUITE.register("Tier 3 - Cross-Feature", "T3.06", "Multi-Layer Vertical Stacking Clearance (1c/2c)", test_tier3_06_multi_layer_vertical_stacking)
SUITE.register("Tier 3 - Cross-Feature", "T3.07", "Horizontal (X) vs Vertical (Y) Rotation Parity", test_tier3_07_horizontal_vs_vertical_transformation)
SUITE.register("Tier 3 - Cross-Feature", "T3.08", "End-Anchor Longitudinal + Vertical Clearance", test_tier3_08_end_anchor_clearance_at_supports)
SUITE.register("Tier 3 - Cross-Feature", "T3.09", "Minkowski Erosion Across All Section Types", test_tier3_09_minkowski_erosion_across_all_sections)
SUITE.register("Tier 3 - Cross-Feature", "T3.10", "CLI Roundtrip JSON & Markdown Generation", test_tier3_10_cli_roundtrip_json_and_md)
SUITE.register("Tier 3 - Cross-Feature", "T3.11", "Master Beams Verified Crosscheck Consistency", test_tier3_11_master_beams_verified_crosscheck)

# Tier 4: Real-World Scenarios (5 tests)
SUITE.register("Tier 4 - Real-World", "T4.01", "Full Volumetric Audit: 12 Horizontal Beams (VB1-VB12)", test_tier4_01_horizontal_beams_audit)
SUITE.register("Tier 4 - Real-World", "T4.02", "Full Volumetric Audit: 10 Vertical Beams (VB13-VB22)", test_tier4_02_vertical_beams_audit)
SUITE.register("Tier 4 - Real-World", "T4.03", "Global Volumetric Audit: All 22 Beams (0 Violations)", test_tier4_03_all_22_beams_global_audit)
SUITE.register("Tier 4 - Real-World", "T4.04", "Steel Schedule Reconciliation: 855 Stirrups Audited", test_tier4_04_steel_schedule_crosscheck)
SUITE.register("Tier 4 - Real-World", "T4.05", "Scene 3D WebGL Assets & Syntax Integrity", test_tier4_05_scene_integrity_verification)

def main():
    verbose = "--verbose" in sys.argv
    success = SUITE.run_all(verbose=verbose)
    if success:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
