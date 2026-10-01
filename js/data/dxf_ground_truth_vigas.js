/**
 * DXF Ground Truth - Vigas Baldrames (VB1 a VB22)
 * Obra: AION-100 (Lucas Hajjar)
 * Fonte da Verdade:
 *   - compilado.dxf (Layers: DT-Forma, DT-Barras rebatidas, DT-Textos, DT-Relação do aço)
 *   - AION-EST-07-BAL-VIG.pdf (Folha 07: Vigas VB1 a VB16)
 *   - AION-EST-08-BAL-VIG.pdf (Folha 08: Vigas VB17 a VB22)
 *   - AION-EST-06-BAL-FOR.pdf (Planta de Fôrma de Baldrames e Locação)
 *   - NBR 6118:2023 (Critérios de Cobrimento e Pinos de Dobramento)
 *
 * Parâmetros de Concreto e Aço:
 *   - Concreto C25 (fck = 25 MPa)
 *   - Nível de Topo zTopo = -10.0 cm
 *   - Cobrimento Nominal c_nom = 3.0 cm (Cobrimento Mínimo c_min = 2.5 cm)
 *   - Aço CA-50: Barras Longitudinais (R_dobra = 3.0 * phi)
 *   - Aço CA-60: Estribos Fechados (R_dobra = 2.0 * phi)
 *
 * Dual export:
 *   - Browser: window.VIGAS_DATA
 *   - Node.js / Test Runner: module.exports = { VIGAS_DATA }
 */

(function (global) {
  'use strict';

  const VIGAS_DATA = {
  "VB1": {
    "id": "VB1",
    "secao": {
      "b": 20.0,
      "h": 45.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 1209.0,
    "apoios": [
      {
        "id": "P1",
        "x": -1711.2,
        "y": 524.4,
        "largura": 60.0
      },
      {
        "id": "P2",
        "x": -1579.7,
        "y": 474.4,
        "largura": 60.0
      },
      {
        "id": "P3",
        "x": -1215.2,
        "y": 474.4,
        "largura": 60.0
      },
      {
        "id": "P4",
        "x": -882.2,
        "y": 474.4,
        "largura": 60.0
      },
      {
        "id": "P5",
        "x": -502.2,
        "y": 474.4,
        "largura": 60.0
      }
    ],
    "prismBox": {
      "xMin": -1741.2,
      "xMax": -472.2,
      "yMin": 534.4,
      "yMax": 554.4,
      "zMin": -55.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        -1741.2,
        -472.2
      ],
      "y": [
        534.4,
        554.4
      ],
      "z": [
        -55.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N51",
        "role": "inf",
        "diamMm": 16.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 1200.0,
        "reto": 1172.0,
        "d1": 14.0,
        "d2": 14.0,
        "d1_confined": 14.0,
        "d2_confined": 14.0,
        "xStart": -1737.4,
        "xEnd": -476.0,
        "sStart": 3.8,
        "sEnd": 1265.2,
        "yCenter": 544.4,
        "yOffset": 6.2,
        "lateralOffsets": [
          -6.2,
          6.2
        ],
        "zLevel": -51.2,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N52",
        "role": "inf",
        "diamMm": 16.0,
        "count": 2,
        "posicao": "Reforço positivo vão P4-P5",
        "comprimento": 236.0,
        "reto": 236.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": -1224.7,
        "xEnd": -988.7,
        "sStart": 516.5,
        "sEnd": 752.5,
        "yCenter": 544.4,
        "yOffset": 6.2,
        "lateralOffsets": [
          -6.2,
          6.2
        ],
        "zLevel": -51.2,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N10",
        "role": "inf",
        "diamMm": 8.0,
        "count": 1,
        "posicao": "Positivo complementar (1c)",
        "comprimento": 1200.0,
        "reto": 1172.0,
        "d1": 14.0,
        "d2": 14.0,
        "d1_confined": 14.0,
        "d2_confined": 14.0,
        "xStart": -1737.8,
        "xEnd": -475.6,
        "sStart": 3.4,
        "sEnd": 1265.6,
        "yCenter": 544.4,
        "yOffset": 6.6,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -51.6,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N9",
        "role": "inf",
        "diamMm": 8.0,
        "count": 1,
        "posicao": "Reforço positivo vão P1-P2",
        "comprimento": 150.0,
        "reto": 136.0,
        "d1": 14.0,
        "d2": 0.0,
        "d1_confined": 14.0,
        "d2_confined": 0.0,
        "xStart": -1174.7,
        "xEnd": -1038.7,
        "sStart": 566.5,
        "sEnd": 702.5,
        "yCenter": 544.4,
        "yOffset": 6.6,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -51.6,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N34",
        "role": "sup",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Porta-estribos corrido",
        "comprimento": 1200.0,
        "reto": 1122.0,
        "d1": 39.0,
        "d2": 39.0,
        "d1_confined": 38.0,
        "d2_confined": 38.0,
        "xStart": -1737.7,
        "xEnd": -615.7,
        "sStart": 3.5,
        "sEnd": 1125.5,
        "yCenter": 544.4,
        "yOffset": 6.5,
        "lateralOffsets": [
          -6.5,
          6.5
        ],
        "zLevel": -13.5,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N9",
        "role": "sup",
        "diamMm": 8.0,
        "count": 1,
        "posicao": "Negativo apoio P1",
        "comprimento": 150.0,
        "reto": 111.0,
        "d1": 39.0,
        "d2": 0.0,
        "d1_confined": 38.2,
        "d2_confined": 0.0,
        "xStart": -1737.8,
        "xEnd": -1626.8,
        "sStart": 3.4,
        "sEnd": 114.4,
        "yCenter": 544.4,
        "yOffset": 6.6,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N54",
        "role": "sup",
        "diamMm": 16.0,
        "count": 1,
        "posicao": "Negativo apoio P2 (1c)",
        "comprimento": 200.0,
        "reto": 200.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": -1679.7,
        "xEnd": -1479.7,
        "sStart": 61.5,
        "sEnd": 261.5,
        "yCenter": 544.4,
        "yOffset": 6.2,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.8,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N54",
        "role": "sup",
        "diamMm": 16.0,
        "count": 1,
        "posicao": "Negativo apoio P3 (1c)",
        "comprimento": 200.0,
        "reto": 200.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": -1315.2,
        "xEnd": -1115.2,
        "sStart": 426.0,
        "sEnd": 626.0,
        "yCenter": 544.4,
        "yOffset": 6.2,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.8,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N54",
        "role": "sup",
        "diamMm": 16.0,
        "count": 1,
        "posicao": "Negativo apoio P4 (1c)",
        "comprimento": 200.0,
        "reto": 200.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": -982.2,
        "xEnd": -782.2,
        "sStart": 759.0,
        "sEnd": 959.0,
        "yCenter": 544.4,
        "yOffset": 6.2,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.8,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N54",
        "role": "sup",
        "diamMm": 16.0,
        "count": 1,
        "posicao": "Negativo apoio P5 (1c)",
        "comprimento": 200.0,
        "reto": 200.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": -676.0,
        "xEnd": -476.0,
        "sStart": 1065.2,
        "sEnd": 1265.2,
        "yCenter": 544.4,
        "yOffset": 6.2,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.8,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N4",
        "role": "pele",
        "diamMm": 6.3,
        "count": 6,
        "posicao": "2x3 N4 ø6.3 C=1200 (PELE)",
        "comprimento": 1200.0,
        "reto": 1200.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": -1737.88,
        "xEnd": -537.88,
        "sStart": 3.31,
        "sEnd": 1203.32,
        "yCenter": 544.4,
        "yOffset": 6.685,
        "lateralOffsets": [
          -6.685,
          6.685
        ],
        "zLevels": [
          -41.5,
          -32.5,
          -23.5
        ],
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      },
      {
        "id": "N5",
        "role": "pele",
        "diamMm": 6.3,
        "count": 6,
        "posicao": "2x3 N5 ø6.3 C=131",
        "comprimento": 131.0,
        "reto": 131.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": -1737.88,
        "xEnd": -1606.88,
        "sStart": 3.31,
        "sEnd": 134.31,
        "yCenter": 544.4,
        "yOffset": 6.685,
        "lateralOffsets": [
          -6.685,
          6.685
        ],
        "zLevels": [
          -41.5,
          -32.5,
          -23.5
        ],
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    ],
    "estribos": [
      {
        "id": "N1",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 14.0,
        "altura": 39.0,
        "comprimento": 117.0,
        "quantTotal": 82,
        "zonas": [
          {
            "vao": "P1-P2",
            "espacamento": 20.0,
            "count": 9,
            "start": 0.0,
            "end": 161.5
          },
          {
            "vao": "P2-P3",
            "espacamento": 20.0,
            "count": 19,
            "start": 161.5,
            "end": 526.0
          },
          {
            "vao": "P3-P4",
            "espacamento": 12.0,
            "count": 28,
            "start": 526.0,
            "end": 859.0
          },
          {
            "vao": "P4-P5",
            "espacamento": 16.0,
            "count": 26,
            "start": 859.0,
            "end": 1269.0
          }
        ]
      }
    ]
  },
  "VB2": {
    "id": "VB2",
    "secao": {
      "b": 20.0,
      "h": 45.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 1140.0,
    "apoios": [
      {
        "id": "P5",
        "x": -502.2,
        "y": 474.4,
        "largura": 60.0
      },
      {
        "id": "P6",
        "x": -122.2,
        "y": 474.4,
        "largura": 60.0
      },
      {
        "id": "P7",
        "x": 257.8,
        "y": 474.4,
        "largura": 60.0
      },
      {
        "id": "P8",
        "x": 637.8,
        "y": 474.4,
        "largura": 60.0
      }
    ],
    "prismBox": {
      "xMin": -532.2,
      "xMax": 667.8,
      "yMin": 534.4,
      "yMax": 554.4,
      "zMin": -55.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        -532.2,
        667.8
      ],
      "y": [
        534.4,
        554.4
      ],
      "z": [
        -55.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N53",
        "role": "inf",
        "diamMm": 16.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 1193.0,
        "reto": 1165.0,
        "d1": 14.0,
        "d2": 14.0,
        "d1_confined": 14.0,
        "d2_confined": 14.0,
        "xStart": -528.4,
        "xEnd": 664.0,
        "sStart": 3.8,
        "sEnd": 1196.2,
        "yCenter": 544.4,
        "yOffset": 6.2,
        "lateralOffsets": [
          -6.2,
          6.2
        ],
        "zLevel": -51.2,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N35",
        "role": "inf",
        "diamMm": 10.0,
        "count": 1,
        "posicao": "Positivo complementar (1c)",
        "comprimento": 1193.0,
        "reto": 1165.0,
        "d1": 14.0,
        "d2": 14.0,
        "d1_confined": 14.0,
        "d2_confined": 14.0,
        "xStart": -528.7,
        "xEnd": 664.3,
        "sStart": 3.5,
        "sEnd": 1196.5,
        "yCenter": 544.4,
        "yOffset": 6.5,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -51.5,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N7",
        "role": "inf",
        "diamMm": 6.3,
        "count": 1,
        "posicao": "Reforço vão P7-P8",
        "comprimento": 172.0,
        "reto": 172.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": -18.2,
        "xEnd": 153.8,
        "sStart": 514.0,
        "sEnd": 686.0,
        "yCenter": 544.4,
        "yOffset": 6.685,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -51.69,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N36",
        "role": "sup",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Porta-estribos corrido",
        "comprimento": 1194.0,
        "reto": 1116.0,
        "d1": 39.0,
        "d2": 39.0,
        "d1_confined": 38.0,
        "d2_confined": 38.0,
        "xStart": -528.7,
        "xEnd": 587.3,
        "sStart": 3.5,
        "sEnd": 1119.5,
        "yCenter": 544.4,
        "yOffset": 6.5,
        "lateralOffsets": [
          -6.5,
          6.5
        ],
        "zLevel": -13.5,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N54",
        "role": "sup",
        "diamMm": 16.0,
        "count": 1,
        "posicao": "Negativo apoio P6 (1c)",
        "comprimento": 200.0,
        "reto": 200.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": -222.2,
        "xEnd": -22.2,
        "sStart": 310.0,
        "sEnd": 510.0,
        "yCenter": 544.4,
        "yOffset": 6.2,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.8,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N54",
        "role": "sup",
        "diamMm": 16.0,
        "count": 1,
        "posicao": "Negativo apoio P7 (1c)",
        "comprimento": 200.0,
        "reto": 200.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": 157.8,
        "xEnd": 357.8,
        "sStart": 690.0,
        "sEnd": 890.0,
        "yCenter": 544.4,
        "yOffset": 6.2,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.8,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N54",
        "role": "sup",
        "diamMm": 16.0,
        "count": 1,
        "posicao": "Negativo apoio P8 (1c)",
        "comprimento": 200.0,
        "reto": 200.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": 464.0,
        "xEnd": 664.0,
        "sStart": 996.2,
        "sEnd": 1196.2,
        "yCenter": 544.4,
        "yOffset": 6.2,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.8,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N6",
        "role": "pele",
        "diamMm": 6.3,
        "count": 6,
        "posicao": "2x3 N6 ø6.3 C=1194 (PELE)",
        "comprimento": 1194.0,
        "reto": 1194.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": -528.88,
        "xEnd": 664.48,
        "sStart": 3.31,
        "sEnd": 1196.68,
        "yCenter": 544.4,
        "yOffset": 6.685,
        "lateralOffsets": [
          -6.685,
          6.685
        ],
        "zLevels": [
          -41.5,
          -32.5,
          -23.5
        ],
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    ],
    "estribos": [
      {
        "id": "N1",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 14.0,
        "altura": 39.0,
        "comprimento": 117.0,
        "quantTotal": 73,
        "zonas": [
          {
            "vao": "P5-P6",
            "espacamento": 20.0,
            "count": 21,
            "start": 0.0,
            "end": 410.0
          },
          {
            "vao": "P6-P7",
            "espacamento": 16.0,
            "count": 24,
            "start": 410.0,
            "end": 790.0
          },
          {
            "vao": "P7-P8",
            "espacamento": 15.0,
            "count": 28,
            "start": 790.0,
            "end": 1200.0
          }
        ]
      }
    ]
  },
  "VB3": {
    "id": "VB3",
    "secao": {
      "b": 20.0,
      "h": 45.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 612.4,
    "apoios": [
      {
        "id": "P8",
        "x": 637.8,
        "y": 474.4,
        "largura": 60.0
      },
      {
        "id": "P9",
        "x": 1025.3,
        "y": 474.4,
        "largura": 60.0
      },
      {
        "id": "P10",
        "x": 1190.2,
        "y": 474.4,
        "largura": 60.0
      }
    ],
    "prismBox": {
      "xMin": 607.8,
      "xMax": 1220.2,
      "yMin": 534.4,
      "yMax": 554.4,
      "zMin": -55.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        607.8,
        1220.2
      ],
      "y": [
        534.4,
        554.4
      ],
      "z": [
        -55.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N11",
        "role": "inf",
        "diamMm": 8.0,
        "count": 3,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 606.0,
        "reto": 578.0,
        "d1": 14.0,
        "d2": 14.0,
        "d1_confined": 14.0,
        "d2_confined": 14.0,
        "xStart": 611.2,
        "xEnd": 1216.8,
        "sStart": 3.4,
        "sEnd": 609.0,
        "yCenter": 544.4,
        "yOffset": 6.6,
        "lateralOffsets": [
          -6.6,
          0.0,
          6.6
        ],
        "zLevel": -51.6,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N37",
        "role": "sup",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Porta-estribos corrido",
        "comprimento": 606.0,
        "reto": 528.0,
        "d1": 39.0,
        "d2": 39.0,
        "d1_confined": 38.0,
        "d2_confined": 38.0,
        "xStart": 611.3,
        "xEnd": 1139.3,
        "sStart": 3.5,
        "sEnd": 531.5,
        "yCenter": 544.4,
        "yOffset": 6.5,
        "lateralOffsets": [
          -6.5,
          6.5
        ],
        "zLevel": -13.5,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N1",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 14.0,
        "altura": 39.0,
        "comprimento": 117.0,
        "quantTotal": 31,
        "zonas": [
          {
            "vao": "P8-P10",
            "espacamento": 20.0,
            "count": 31,
            "start": 0.0,
            "end": 612.3
          }
        ]
      }
    ]
  },
  "VB4": {
    "id": "VB4",
    "secao": {
      "b": 40.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 581.0,
    "apoios": [
      {
        "id": "P10",
        "x": 1190.2,
        "y": 474.4,
        "largura": 60.0
      },
      {
        "id": "P11",
        "x": 1711.2,
        "y": 474.4,
        "largura": 60.0
      }
    ],
    "prismBox": {
      "xMin": 1160.2,
      "xMax": 1741.2,
      "yMin": 514.4,
      "yMax": 554.4,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        1160.2,
        1741.2
      ],
      "y": [
        514.4,
        554.4
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N14",
        "role": "inf",
        "diamMm": 8.0,
        "count": 6,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 630.0,
        "reto": 572.0,
        "d1": 29.0,
        "d2": 29.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": 1163.6,
        "xEnd": 1737.8,
        "sStart": 3.4,
        "sEnd": 577.6,
        "yCenter": 534.4,
        "yOffset": 16.6,
        "lateralOffsets": [
          -16.6,
          -9.96,
          -3.32,
          3.32,
          9.96,
          16.6
        ],
        "zLevel": -36.6,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N12",
        "role": "sup",
        "diamMm": 8.0,
        "count": 4,
        "posicao": "Porta-estribos corrido",
        "comprimento": 575.0,
        "reto": 527.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": 1163.6,
        "xEnd": 1690.6,
        "sStart": 3.4,
        "sEnd": 530.4,
        "yCenter": 534.4,
        "yOffset": 16.6,
        "lateralOffsets": [
          -16.6,
          -5.533,
          5.533,
          16.6
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N13",
        "role": "sup",
        "diamMm": 8.0,
        "count": 1,
        "posicao": "Negativo apoio P10",
        "comprimento": 255.0,
        "reto": 231.0,
        "d1": 24.0,
        "d2": 0.0,
        "d1_confined": 23.2,
        "d2_confined": 0.0,
        "xStart": 1163.6,
        "xEnd": 1394.6,
        "sStart": 3.4,
        "sEnd": 234.4,
        "yCenter": 534.4,
        "yOffset": 16.6,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N2",
        "diamMm": 5.0,
        "tipo": "duplo",
        "largura": 23.0,
        "altura": 24.0,
        "comprimento": 105.0,
        "quantTotal": 78,
        "zonas": [
          {
            "vao": "P10-P11",
            "espacamento": 15.0,
            "count": 78,
            "start": 0.0,
            "end": 581.0
          }
        ]
      }
    ]
  },
  "VB5": {
    "id": "VB5",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 1133.3,
    "apoios": [
      {
        "id": "P12",
        "x": 637.8,
        "y": 248.9,
        "largura": 60.0
      },
      {
        "id": "P13",
        "x": 1019.8,
        "y": 248.9,
        "largura": 60.0
      },
      {
        "id": "P14",
        "x": 1190.2,
        "y": 254.4,
        "largura": 60.0
      },
      {
        "id": "P15",
        "x": 1711.2,
        "y": 259.9,
        "largura": 60.0
      }
    ],
    "prismBox": {
      "xMin": 607.8,
      "xMax": 1741.2,
      "yMin": 244.9,
      "yMax": 263.9,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        607.8,
        1741.2
      ],
      "y": [
        244.9,
        263.9
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N38",
        "role": "inf",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Positivo corrido",
        "comprimento": 1128.0,
        "reto": 1080.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.0,
        "d2_confined": 23.0,
        "xStart": 611.3,
        "xEnd": 1737.7,
        "sStart": 3.5,
        "sEnd": 1129.9,
        "yCenter": 254.4,
        "yOffset": 6.0,
        "lateralOffsets": [
          -6.0,
          6.0
        ],
        "zLevel": -36.5,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N15",
        "role": "inf",
        "diamMm": 8.0,
        "count": 1,
        "posicao": "Reforço positivo vão P12-P13",
        "comprimento": 376.0,
        "reto": 376.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": 986.5,
        "xEnd": 1362.5,
        "sStart": 378.7,
        "sEnd": 754.7,
        "yCenter": 254.4,
        "yOffset": 6.1,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -36.6,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N18",
        "role": "sup",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 1155.0,
        "reto": 1107.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": 611.2,
        "xEnd": 1718.2,
        "sStart": 3.4,
        "sEnd": 1110.4,
        "yCenter": 254.4,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N17",
        "role": "sup",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Negativo apoio P13-P14",
        "comprimento": 926.0,
        "reto": 898.0,
        "d1": 0.0,
        "d2": 28.0,
        "d1_confined": 0.0,
        "d2_confined": 23.2,
        "xStart": 839.8,
        "xEnd": 1737.8,
        "sStart": 232.0,
        "sEnd": 1130.0,
        "yCenter": 254.4,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N16",
        "role": "sup",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Negativo apoio P14-P15 (2c)",
        "comprimento": 716.0,
        "reto": 688.0,
        "d1": 0.0,
        "d2": 28.0,
        "d1_confined": 0.0,
        "d2_confined": 23.2,
        "xStart": 1049.8,
        "xEnd": 1737.8,
        "sStart": 442.0,
        "sEnd": 1130.0,
        "yCenter": 254.4,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N3",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 77,
        "zonas": [
          {
            "vao": "P12-P13",
            "espacamento": 15.0,
            "count": 28,
            "start": 0.0,
            "end": 412.0
          },
          {
            "vao": "P13-P14",
            "espacamento": 15.0,
            "count": 12,
            "start": 412.0,
            "end": 582.3
          },
          {
            "vao": "P14-P15",
            "espacamento": 15.0,
            "count": 37,
            "start": 582.3,
            "end": 1133.3
          }
        ]
      }
    ]
  },
  "VB6": {
    "id": "VB6",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 492.0,
    "apoios": [
      {
        "id": "P16",
        "x": 643.3,
        "y": 25.9,
        "largura": 60.0
      },
      {
        "id": "P17",
        "x": 1019.8,
        "y": 31.4,
        "largura": 160.0
      }
    ],
    "prismBox": {
      "xMin": 607.8,
      "xMax": 1099.8,
      "yMin": 16.4,
      "yMax": 35.4,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        607.8,
        1099.8
      ],
      "y": [
        16.4,
        35.4
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N19",
        "role": "inf",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 486.0,
        "reto": 438.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": 611.2,
        "xEnd": 1096.4,
        "sStart": 3.4,
        "sEnd": 488.6,
        "yCenter": 25.9,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -36.6,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N19",
        "role": "sup",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 486.0,
        "reto": 438.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": 611.2,
        "xEnd": 1049.2,
        "sStart": 3.4,
        "sEnd": 441.4,
        "yCenter": 25.9,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N3",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 33,
        "zonas": [
          {
            "vao": "P16-P17",
            "espacamento": 15.0,
            "count": 33,
            "start": 0.0,
            "end": 492.0
          }
        ]
      }
    ]
  },
  "VB7": {
    "id": "VB7",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 439.0,
    "apoios": [
      {
        "id": "VB17",
        "x": 637.8,
        "y": -109.1,
        "largura": 19.0
      },
      {
        "id": "VB19",
        "x": 1019.8,
        "y": -109.1,
        "largura": 19.0
      }
    ],
    "prismBox": {
      "xMin": 628.3,
      "xMax": 1029.3,
      "yMin": -118.6,
      "yMax": -99.6,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        628.3,
        1029.3
      ],
      "y": [
        -118.6,
        -99.6
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N44",
        "role": "inf",
        "diamMm": 12.5,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 395.0,
        "reto": 347.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 22.75,
        "d2_confined": 22.75,
        "xStart": 631.92,
        "xEnd": 1025.67,
        "sStart": 3.62,
        "sEnd": 397.38,
        "yCenter": -109.1,
        "yOffset": 5.875,
        "lateralOffsets": [
          -5.875,
          5.875
        ],
        "zLevel": -36.38,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N20",
        "role": "sup",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Porta-estribos corrido",
        "comprimento": 395.0,
        "reto": 347.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": 631.7,
        "xEnd": 978.7,
        "sStart": 3.4,
        "sEnd": 350.4,
        "yCenter": -109.1,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N3",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 30,
        "zonas": [
          {
            "vao": "",
            "espacamento": 11.0,
            "count": 10,
            "start": 0.0,
            "end": 110.0
          },
          {
            "vao": "",
            "espacamento": 11.0,
            "count": 10,
            "start": 110.0,
            "end": 220.0
          },
          {
            "vao": "",
            "espacamento": 15.0,
            "count": 10,
            "start": 220.0,
            "end": 363.0
          }
        ]
      }
    ]
  },
  "VB8": {
    "id": "VB8",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 419.0,
    "apoios": [
      {
        "id": "P19",
        "x": -1589.7,
        "y": -313.5,
        "largura": 60.0
      },
      {
        "id": "E2",
        "x": -1220.7,
        "y": -313.5,
        "largura": 40.0
      }
    ],
    "prismBox": {
      "xMin": -1619.7,
      "xMax": -1200.7,
      "yMin": -323.0,
      "yMax": -304.0,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        -1619.7,
        -1200.7
      ],
      "y": [
        -323.0,
        -304.0
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N42",
        "role": "inf",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 413.0,
        "reto": 389.0,
        "d1": 24.0,
        "d2": 0.0,
        "d1_confined": 23.0,
        "d2_confined": 0.0,
        "xStart": -1616.2,
        "xEnd": -1204.2,
        "sStart": 3.5,
        "sEnd": 415.5,
        "yCenter": -313.5,
        "yOffset": 6.0,
        "lateralOffsets": [
          -6.0,
          6.0
        ],
        "zLevel": -36.5,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N43",
        "role": "sup",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 435.0,
        "reto": 413.0,
        "d1": 24.0,
        "d2": 0.0,
        "d1_confined": 23.0,
        "d2_confined": 0.0,
        "xStart": -1616.2,
        "xEnd": -1204.2,
        "sStart": 3.5,
        "sEnd": 415.5,
        "yCenter": -313.5,
        "yOffset": 6.0,
        "lateralOffsets": [
          -6.0,
          6.0
        ],
        "zLevel": -13.5,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N3",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 26,
        "zonas": [
          {
            "vao": "P19-E2",
            "espacamento": 15.0,
            "count": 26,
            "start": 0.0,
            "end": 379.0
          }
        ]
      }
    ]
  },
  "VB9": {
    "id": "VB9",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 184.0,
    "apoios": [
      {
        "id": "E3",
        "x": 502.3,
        "y": -312.0,
        "largura": 40.0
      },
      {
        "id": "VB17",
        "x": 637.8,
        "y": -312.0,
        "largura": 19.0
      }
    ],
    "prismBox": {
      "xMin": 483.3,
      "xMax": 647.3,
      "yMin": -321.5,
      "yMax": -302.5,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        483.3,
        647.3
      ],
      "y": [
        -321.5,
        -302.5
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N21",
        "role": "inf",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 167.0,
        "reto": 133.0,
        "d1": 24.0,
        "d2": 10.0,
        "d1_confined": 23.2,
        "d2_confined": 10.0,
        "xStart": 486.7,
        "xEnd": 643.9,
        "sStart": 3.4,
        "sEnd": 160.6,
        "yCenter": -312.0,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -36.6,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N22",
        "role": "sup",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 209.0,
        "reto": 159.0,
        "d1": 24.0,
        "d2": 26.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": 486.7,
        "xEnd": 643.9,
        "sStart": 3.4,
        "sEnd": 160.6,
        "yCenter": -312.0,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N3",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 9,
        "zonas": [
          {
            "vao": "E3-VB17",
            "espacamento": 15.0,
            "count": 9,
            "start": 0.0,
            "end": 125.0
          }
        ]
      }
    ]
  },
  "VB10": {
    "id": "VB10",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 1153.0,
    "apoios": [
      {
        "id": "P20",
        "x": -1595.2,
        "y": -519.0,
        "largura": 60.0
      },
      {
        "id": "P23",
        "x": -1215.2,
        "y": -524.5,
        "largura": 60.0
      },
      {
        "id": "P24",
        "x": -882.2,
        "y": -524.5,
        "largura": 60.0
      },
      {
        "id": "P25",
        "x": -502.2,
        "y": -524.5,
        "largura": 60.0
      }
    ],
    "prismBox": {
      "xMin": -1625.2,
      "xMax": -472.2,
      "yMin": -534.0,
      "yMax": -515.0,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        -1625.2,
        -472.2
      ],
      "y": [
        -534.0,
        -515.0
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N46",
        "role": "inf",
        "diamMm": 12.5,
        "count": 3,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 1158.0,
        "reto": 1147.0,
        "d1": 14.0,
        "d2": 0.0,
        "d1_confined": 14.0,
        "d2_confined": 0.0,
        "xStart": -1621.58,
        "xEnd": -475.83,
        "sStart": 3.62,
        "sEnd": 1149.38,
        "yCenter": -524.5,
        "yOffset": 5.875,
        "lateralOffsets": [
          -5.875,
          0.0,
          5.875
        ],
        "zLevel": -36.38,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N23",
        "role": "sup",
        "diamMm": 8.0,
        "count": 3,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 1147.0,
        "reto": 1099.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": -1621.8,
        "xEnd": -522.8,
        "sStart": 3.4,
        "sEnd": 1102.4,
        "yCenter": -524.5,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          0.0,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N3",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 80,
        "zonas": [
          {
            "vao": "P20-P23",
            "espacamento": 15.0,
            "count": 28,
            "start": 0.0,
            "end": 410.0
          },
          {
            "vao": "P23-P24",
            "espacamento": 14.0,
            "count": 24,
            "start": 410.0,
            "end": 743.0
          },
          {
            "vao": "P24-P25",
            "espacamento": 15.0,
            "count": 28,
            "start": 743.0,
            "end": 1153.0
          }
        ]
      }
    ]
  },
  "VB11": {
    "id": "VB11",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 1140.0,
    "apoios": [
      {
        "id": "P25",
        "x": -502.2,
        "y": -524.5,
        "largura": 60.0
      },
      {
        "id": "P26",
        "x": -122.2,
        "y": -524.5,
        "largura": 60.0
      },
      {
        "id": "P27",
        "x": 257.8,
        "y": -524.5,
        "largura": 60.0
      },
      {
        "id": "VB16",
        "x": 363.0,
        "y": -524.5,
        "largura": 19.0
      },
      {
        "id": "P21",
        "x": 1019.8,
        "y": -519.0,
        "largura": 60.0
      }
    ],
    "prismBox": {
      "xMin": -532.2,
      "xMax": 667.8,
      "yMin": -534.0,
      "yMax": -515.0,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        -532.2,
        667.8
      ],
      "y": [
        -534.0,
        -515.0
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N48",
        "role": "inf",
        "diamMm": 12.5,
        "count": 3,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 1085.0,
        "reto": 1074.0,
        "d1": 14.0,
        "d2": 0.0,
        "d1_confined": 14.0,
        "d2_confined": 0.0,
        "xStart": -528.58,
        "xEnd": 664.17,
        "sStart": 3.62,
        "sEnd": 1196.38,
        "yCenter": -524.5,
        "yOffset": 5.875,
        "lateralOffsets": [
          -5.875,
          0.0,
          5.875
        ],
        "zLevel": -36.38,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N49",
        "role": "inf",
        "diamMm": 12.5,
        "count": 2,
        "posicao": "Reforço vão P26-P27 (1c)",
        "comprimento": 226.0,
        "reto": 215.0,
        "d1": 14.0,
        "d2": 0.0,
        "d1_confined": 14.0,
        "d2_confined": 0.0,
        "xStart": -39.7,
        "xEnd": 175.3,
        "sStart": 492.5,
        "sEnd": 707.5,
        "yCenter": -524.5,
        "yOffset": 5.875,
        "lateralOffsets": [
          -5.875,
          5.875
        ],
        "zLevel": -36.38,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N25",
        "role": "sup",
        "diamMm": 8.0,
        "count": 3,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 1194.0,
        "reto": 1146.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": -528.8,
        "xEnd": 617.2,
        "sStart": 3.4,
        "sEnd": 1149.4,
        "yCenter": -524.5,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          0.0,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N24",
        "role": "sup",
        "diamMm": 8.0,
        "count": 1,
        "posicao": "Negativo apoio P27-VB16 (1c)",
        "comprimento": 387.0,
        "reto": 387.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "xStart": 64.3,
        "xEnd": 451.3,
        "sStart": 596.5,
        "sEnd": 983.5,
        "yCenter": -524.5,
        "yOffset": 6.1,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N3",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 82,
        "zonas": [
          {
            "vao": "P25-P26",
            "espacamento": 15.0,
            "count": 28,
            "start": 0.0,
            "end": 410.0
          },
          {
            "vao": "P26-P27",
            "espacamento": 15.0,
            "count": 26,
            "start": 410.0,
            "end": 790.0
          },
          {
            "vao": "P27-P21",
            "espacamento": 15.0,
            "count": 28,
            "start": 790.0,
            "end": 1200.0
          }
        ]
      }
    ]
  },
  "VB12": {
    "id": "VB12",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "X",
    "comprimentoTotal": 442.0,
    "apoios": [
      {
        "id": "P21",
        "x": 1019.8,
        "y": -519.0,
        "largura": 60.0
      },
      {
        "id": "P22",
        "x": 637.8,
        "y": -519.0,
        "largura": 60.0
      }
    ],
    "prismBox": {
      "xMin": 607.8,
      "xMax": 1049.8,
      "yMin": -534.0,
      "yMax": -515.0,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        607.8,
        1049.8
      ],
      "y": [
        -534.0,
        -515.0
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N26",
        "role": "inf",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 436.0,
        "reto": 388.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": 611.2,
        "xEnd": 1046.4,
        "sStart": 3.4,
        "sEnd": 438.6,
        "yCenter": -524.5,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -36.6,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N26",
        "role": "sup",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 436.0,
        "reto": 388.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "xStart": 611.2,
        "xEnd": 999.2,
        "sStart": 3.4,
        "sEnd": 391.4,
        "yCenter": -524.5,
        "yOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N27",
        "role": "sup",
        "diamMm": 8.0,
        "count": 1,
        "posicao": "Negativo apoio P21 (1c)",
        "comprimento": 172.0,
        "reto": 148.0,
        "d1": 24.0,
        "d2": 0.0,
        "d1_confined": 23.2,
        "d2_confined": 0.0,
        "xStart": 611.2,
        "xEnd": 759.2,
        "sStart": 3.4,
        "sEnd": 151.4,
        "yCenter": -524.5,
        "yOffset": 6.1,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 1,
          "y": 0,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N3",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 30,
        "zonas": [
          {
            "vao": "P21-P22",
            "espacamento": 15.0,
            "count": 30,
            "start": 0.0,
            "end": 442.0
          }
        ]
      }
    ]
  },
  "VB13": {
    "id": "VB13",
    "secao": {
      "b": 20.0,
      "h": 45.0
    },
    "zTopo": -10.0,
    "eixo": "Y",
    "comprimentoTotal": 546.0,
    "apoios": [
      {
        "id": "P20",
        "x": -1595.2,
        "y": -519.0,
        "largura": 60.0
      },
      {
        "id": "P19",
        "x": -1589.7,
        "y": -313.5,
        "largura": 60.0
      },
      {
        "id": "P18",
        "x": -1579.7,
        "y": -33.0,
        "largura": 60.0
      }
    ],
    "prismBox": {
      "xMin": -1605.2,
      "xMax": -1585.2,
      "yMin": -549.0,
      "yMax": -3.0,
      "zMin": -55.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        -1605.2,
        -1585.2
      ],
      "y": [
        -549.0,
        -3.0
      ],
      "z": [
        -55.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N28",
        "role": "inf",
        "diamMm": 8.0,
        "count": 3,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 540.0,
        "reto": 512.0,
        "d1": 14.0,
        "d2": 14.0,
        "d1_confined": 14.0,
        "d2_confined": 14.0,
        "yStart": -545.6,
        "yEnd": -6.4,
        "sStart": 3.4,
        "sEnd": 542.6,
        "xCenter": -1595.2,
        "xOffset": 6.6,
        "lateralOffsets": [
          -6.6,
          0.0,
          6.6
        ],
        "zLevel": -51.6,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N29",
        "role": "sup",
        "diamMm": 8.0,
        "count": 4,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 577.0,
        "reto": 499.0,
        "d1": 39.0,
        "d2": 39.0,
        "d1_confined": 38.2,
        "d2_confined": 38.2,
        "yStart": -545.6,
        "yEnd": -46.6,
        "sStart": 3.4,
        "sEnd": 502.4,
        "xCenter": -1595.2,
        "xOffset": 6.6,
        "lateralOffsets": [
          -6.6,
          -2.2,
          2.2,
          6.6
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N8",
        "role": "pele",
        "diamMm": 6.3,
        "count": 6,
        "posicao": "2x3 N8 ø6.3 C=260 (PELE)",
        "comprimento": 260.0,
        "reto": 260.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "yStart": -545.68,
        "yEnd": -285.69,
        "sStart": 3.31,
        "sEnd": 263.31,
        "xCenter": -1595.2,
        "xOffset": 6.685,
        "lateralOffsets": [
          -6.685,
          6.685
        ],
        "zLevels": [
          -41.5,
          -32.5,
          -23.5
        ],
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      }
    ],
    "estribos": [
      {
        "id": "N1",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 14.0,
        "altura": 39.0,
        "comprimento": 117.0,
        "quantTotal": 36,
        "zonas": [
          {
            "vao": "P20-P19",
            "espacamento": 16.0,
            "count": 15,
            "start": 0.0,
            "end": 235.5
          },
          {
            "vao": "P19-P18 trecho 1",
            "espacamento": 13.0,
            "count": 13,
            "start": 235.5,
            "end": 404.5
          },
          {
            "vao": "P19-P18 trecho 2",
            "espacamento": 20.0,
            "count": 8,
            "start": 404.5,
            "end": 546.0
          }
        ]
      }
    ]
  },
  "VB14": {
    "id": "VB14",
    "secao": {
      "b": 20.0,
      "h": 45.0
    },
    "zTopo": -10.0,
    "eixo": "Y",
    "comprimentoTotal": 617.5,
    "apoios": [
      {
        "id": "P18",
        "x": -1579.7,
        "y": -33.0,
        "largura": 60.0
      },
      {
        "id": "E1",
        "x": -1564.2,
        "y": 256.4,
        "largura": 40.0
      },
      {
        "id": "P2",
        "x": -1579.7,
        "y": 474.4,
        "largura": 160.0
      }
    ],
    "prismBox": {
      "xMin": -1574.2,
      "xMax": -1554.2,
      "yMin": -63.0,
      "yMax": 554.4,
      "zMin": -55.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        -1574.2,
        -1554.2
      ],
      "y": [
        -63.0,
        554.4
      ],
      "z": [
        -55.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N39",
        "role": "inf",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 611.0,
        "reto": 583.0,
        "d1": 14.0,
        "d2": 14.0,
        "d1_confined": 14.0,
        "d2_confined": 14.0,
        "yStart": -59.5,
        "yEnd": 550.9,
        "sStart": 3.5,
        "sEnd": 613.9,
        "xCenter": -1564.2,
        "xOffset": 6.5,
        "lateralOffsets": [
          -6.5,
          6.5
        ],
        "zLevel": -51.5,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N41",
        "role": "sup",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 639.0,
        "reto": 611.0,
        "d1": 30.0,
        "d2": 0.0,
        "d1_confined": 30.0,
        "d2_confined": 0.0,
        "yStart": -59.5,
        "yEnd": 550.9,
        "sStart": 3.5,
        "sEnd": 613.9,
        "xCenter": -1564.2,
        "xOffset": 6.5,
        "lateralOffsets": [
          -6.5,
          6.5
        ],
        "zLevel": -13.5,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N40",
        "role": "sup",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Negativo apoio E1-P2 (1c)",
        "comprimento": 325.0,
        "reto": 297.0,
        "d1": 0.0,
        "d2": 30.0,
        "d1_confined": 0.0,
        "d2_confined": 30.0,
        "yStart": 253.9,
        "yEnd": 550.9,
        "sStart": 316.9,
        "sEnd": 613.9,
        "xCenter": -1564.2,
        "xOffset": 6.5,
        "lateralOffsets": [
          -6.5,
          6.5
        ],
        "zLevel": -13.5,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N1",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 14.0,
        "altura": 39.0,
        "comprimento": 117.0,
        "quantTotal": 40,
        "zonas": [
          {
            "vao": "P18-E1",
            "espacamento": 16.0,
            "count": 23,
            "start": 0.0,
            "end": 368.0
          },
          {
            "vao": "E1-P2",
            "espacamento": 15.0,
            "count": 17,
            "start": 368.0,
            "end": 617.4
          }
        ]
      }
    ]
  },
  "VB15": {
    "id": "VB15",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "Y",
    "comprimentoTotal": 261.0,
    "apoios": [
      {
        "id": "P23",
        "x": -1215.2,
        "y": -524.5,
        "largura": 60.0
      },
      {
        "id": "E2",
        "x": -1220.7,
        "y": -313.5,
        "largura": 40.0
      }
    ],
    "prismBox": {
      "xMin": -1230.2,
      "xMax": -1211.2,
      "yMin": -554.5,
      "yMax": -293.5,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        -1230.2,
        -1211.2
      ],
      "y": [
        -554.5,
        -293.5
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N30",
        "role": "inf",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 255.0,
        "reto": 231.0,
        "d1": 24.0,
        "d2": 0.0,
        "d1_confined": 23.2,
        "d2_confined": 0.0,
        "yStart": -551.1,
        "yEnd": -296.9,
        "sStart": 3.4,
        "sEnd": 257.6,
        "xCenter": -1220.7,
        "xOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -36.6,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N31",
        "role": "sup",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 305.0,
        "reto": 255.0,
        "d1": 24.0,
        "d2": 26.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "yStart": -551.1,
        "yEnd": -296.9,
        "sStart": 3.4,
        "sEnd": 257.6,
        "xCenter": -1220.7,
        "xOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N3",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 15,
        "zonas": [
          {
            "vao": "P23-E2",
            "espacamento": 15.0,
            "count": 15,
            "start": 0.0,
            "end": 221.0
          }
        ]
      }
    ]
  },
  "VB16": {
    "id": "VB16",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "Y",
    "comprimentoTotal": 261.0,
    "apoios": [
      {
        "id": "VB11",
        "x": 502.3,
        "y": -524.5,
        "largura": 19.0
      },
      {
        "id": "E3",
        "x": 502.3,
        "y": -312.0,
        "largura": 40.0
      }
    ],
    "prismBox": {
      "xMin": 492.8,
      "xMax": 511.8,
      "yMin": -534.0,
      "yMax": -293.0,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        492.8,
        511.8
      ],
      "y": [
        -534.0,
        -293.0
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N32",
        "role": "inf",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 236.0,
        "reto": 212.0,
        "d1": 24.0,
        "d2": 0.0,
        "d1_confined": 23.2,
        "d2_confined": 0.0,
        "yStart": -530.6,
        "yEnd": -296.4,
        "sStart": 3.4,
        "sEnd": 237.6,
        "xCenter": 502.3,
        "xOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -36.6,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N33",
        "role": "sup",
        "diamMm": 8.0,
        "count": 4,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 282.0,
        "reto": 236.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.2,
        "d2_confined": 23.2,
        "yStart": -530.6,
        "yEnd": -296.4,
        "sStart": 3.4,
        "sEnd": 237.6,
        "xCenter": 502.3,
        "xOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          -2.033,
          2.033,
          6.1
        ],
        "zLevel": -13.4,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N3",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 13,
        "zonas": [
          {
            "vao": "VB11-E3",
            "espacamento": 15.0,
            "count": 13,
            "start": 0.0,
            "end": 183.0
          }
        ]
      }
    ]
  },
  "VB17": {
    "id": "VB17",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "Y",
    "comprimentoTotal": 710.4,
    "apoios": [
      {
        "id": "P21",
        "x": 1019.8,
        "y": -519.0,
        "largura": 160.0
      },
      {
        "id": "VB9",
        "x": 637.8,
        "y": -359.0,
        "largura": 19.0
      },
      {
        "id": "VB7",
        "x": 637.8,
        "y": -128.6,
        "largura": 19.0
      },
      {
        "id": "P16",
        "x": 643.3,
        "y": 25.9,
        "largura": 160.0
      }
    ],
    "prismBox": {
      "xMin": 628.3,
      "xMax": 647.3,
      "yMin": -599.0,
      "yMax": 111.4,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        628.3,
        647.3
      ],
      "y": [
        -599.0,
        111.4
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N5",
        "role": "inf",
        "diamMm": 8.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 712.0,
        "reto": 704.0,
        "d1": 10.0,
        "d2": 0.0,
        "d1_confined": 10.0,
        "d2_confined": 0.0,
        "yStart": -595.6,
        "yEnd": 108.0,
        "sStart": 3.4,
        "sEnd": 707.0,
        "xCenter": 637.8,
        "xOffset": 6.1,
        "lateralOffsets": [
          -6.1,
          6.1
        ],
        "zLevel": -36.6,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N14",
        "role": "inf",
        "diamMm": 12.5,
        "count": 3,
        "posicao": "Reforço vão central (1c)",
        "comprimento": 337.0,
        "reto": 337.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "yStart": -412.3,
        "yEnd": -75.3,
        "sStart": 186.7,
        "sEnd": 523.7,
        "xCenter": 637.8,
        "xOffset": 5.875,
        "lateralOffsets": [
          -5.875,
          0.0,
          5.875
        ],
        "zLevel": -36.38,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N8",
        "role": "sup",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 417.0,
        "reto": 369.0,
        "d1": 24.0,
        "d2": 24.0,
        "d1_confined": 23.0,
        "d2_confined": 23.0,
        "yStart": -595.5,
        "yEnd": -226.5,
        "sStart": 3.5,
        "sEnd": 372.5,
        "xCenter": 637.8,
        "xOffset": 6.0,
        "lateralOffsets": [
          -6.0,
          6.0
        ],
        "zLevel": -13.5,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N3",
        "role": "sup",
        "diamMm": 6.3,
        "count": 2,
        "posicao": "Negativo apoio P21 (1c)",
        "comprimento": 371.0,
        "reto": 371.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "yStart": -595.68,
        "yEnd": -224.69,
        "sStart": 3.31,
        "sEnd": 374.31,
        "xCenter": 637.8,
        "xOffset": 6.185,
        "lateralOffsets": [
          -6.185,
          6.185
        ],
        "zLevel": -13.31,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N1",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 28,
        "zonas": [
          {
            "vao": "P21-P16",
            "espacamento": 15.0,
            "count": 28,
            "start": 0.0,
            "end": 390.4
          }
        ]
      }
    ]
  },
  "VB18": {
    "id": "VB18",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "Y",
    "comprimentoTotal": 603.0,
    "apoios": [
      {
        "id": "P16",
        "x": 643.3,
        "y": 25.9,
        "largura": 160.0
      },
      {
        "id": "P12",
        "x": 637.8,
        "y": 248.9,
        "largura": 60.0
      },
      {
        "id": "P8",
        "x": 637.8,
        "y": 474.4,
        "largura": 160.0
      }
    ],
    "prismBox": {
      "xMin": 628.3,
      "xMax": 647.3,
      "yMin": -48.6,
      "yMax": 554.4,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        628.3,
        647.3
      ],
      "y": [
        -48.6,
        554.4
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N12",
        "role": "inf",
        "diamMm": 10.0,
        "count": 3,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 597.0,
        "reto": 597.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "yStart": -45.1,
        "yEnd": 550.9,
        "sStart": 3.5,
        "sEnd": 599.5,
        "xCenter": 637.8,
        "xOffset": 6.0,
        "lateralOffsets": [
          -6.0,
          0.0,
          6.0
        ],
        "zLevel": -36.5,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N16",
        "role": "sup",
        "diamMm": 12.5,
        "count": 3,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 618.0,
        "reto": 597.0,
        "d1": 24.0,
        "d2": 0.0,
        "d1_confined": 22.75,
        "d2_confined": 0.0,
        "yStart": -44.98,
        "yEnd": 550.77,
        "sStart": 3.62,
        "sEnd": 599.38,
        "xCenter": 637.8,
        "xOffset": 5.875,
        "lateralOffsets": [
          -5.875,
          0.0,
          5.875
        ],
        "zLevel": -13.62,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N1",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 18,
        "zonas": [
          {
            "vao": "P16-P12",
            "espacamento": 15.0,
            "count": 9,
            "start": 0.0,
            "end": 107.5
          },
          {
            "vao": "P12-P8",
            "espacamento": 15.0,
            "count": 9,
            "start": 107.5,
            "end": 223.0
          }
        ]
      }
    ]
  },
  "VB19": {
    "id": "VB19",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "Y",
    "comprimentoTotal": 660.4,
    "apoios": [
      {
        "id": "P22",
        "x": 637.8,
        "y": -519.0,
        "largura": 160.0
      },
      {
        "id": "VB7",
        "x": 1019.8,
        "y": -268.8,
        "largura": 19.0
      },
      {
        "id": "P17",
        "x": 1019.8,
        "y": 31.4,
        "largura": 60.0
      }
    ],
    "prismBox": {
      "xMin": 1010.3,
      "xMax": 1029.3,
      "yMin": -599.0,
      "yMax": 61.4,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        1010.3,
        1029.3
      ],
      "y": [
        -599.0,
        61.4
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N9",
        "role": "inf",
        "diamMm": 10.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 664.0,
        "reto": 654.0,
        "d1": 12.0,
        "d2": 0.0,
        "d1_confined": 12.0,
        "d2_confined": 0.0,
        "yStart": -595.5,
        "yEnd": 57.9,
        "sStart": 3.5,
        "sEnd": 656.9,
        "xCenter": 1019.8,
        "xOffset": 6.0,
        "lateralOffsets": [
          -6.0,
          6.0
        ],
        "zLevel": -36.5,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N18",
        "role": "sup",
        "diamMm": 16.0,
        "count": 2,
        "posicao": "Porta-estribos corrido",
        "comprimento": 654.0,
        "reto": 630.0,
        "d1": 24.0,
        "d2": 0.0,
        "d1_confined": 22.4,
        "d2_confined": 0.0,
        "yStart": -595.2,
        "yEnd": 34.8,
        "sStart": 3.8,
        "sEnd": 633.8,
        "xCenter": 1019.8,
        "xOffset": 5.7,
        "lateralOffsets": [
          -5.7,
          5.7
        ],
        "zLevel": -13.8,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      },
      {
        "id": "N4",
        "role": "sup",
        "diamMm": 6.3,
        "count": 1,
        "posicao": "Negativo apoio P22",
        "comprimento": 171.0,
        "reto": 171.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "yStart": -595.68,
        "yEnd": -424.69,
        "sStart": 3.31,
        "sEnd": 174.31,
        "xCenter": 1019.8,
        "xOffset": 6.185,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -13.31,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N1",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 31,
        "zonas": [
          {
            "vao": "P22-P17",
            "espacamento": 15.0,
            "count": 31,
            "start": 0.0,
            "end": 440.4
          }
        ]
      }
    ]
  },
  "VB20": {
    "id": "VB20",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "Y",
    "comprimentoTotal": 553.0,
    "apoios": [
      {
        "id": "P17",
        "x": 1019.8,
        "y": 31.4,
        "largura": 60.0
      },
      {
        "id": "P13",
        "x": 1019.8,
        "y": 248.9,
        "largura": 160.0
      },
      {
        "id": "P9",
        "x": 1025.3,
        "y": 474.4,
        "largura": 160.0
      }
    ],
    "prismBox": {
      "xMin": 1010.3,
      "xMax": 1029.3,
      "yMin": 1.4,
      "yMax": 554.4,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        1010.3,
        1029.3
      ],
      "y": [
        1.4,
        554.4
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N10",
        "role": "inf",
        "diamMm": 10.0,
        "count": 3,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 571.0,
        "reto": 547.0,
        "d1": 10.0,
        "d2": 19.0,
        "d1_confined": 10.0,
        "d2_confined": 19.0,
        "yStart": 4.9,
        "yEnd": 550.9,
        "sStart": 3.5,
        "sEnd": 549.5,
        "xCenter": 1019.8,
        "xOffset": 6.0,
        "lateralOffsets": [
          -6.0,
          0.0,
          6.0
        ],
        "zLevel": -36.5,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N3",
        "role": "inf",
        "diamMm": 6.3,
        "count": 1,
        "posicao": "Reforço vão P17-P13",
        "comprimento": 371.0,
        "reto": 371.0,
        "d1": 0.0,
        "d2": 0.0,
        "d1_confined": 0.0,
        "d2_confined": 0.0,
        "yStart": 92.4,
        "yEnd": 463.4,
        "sStart": 91.0,
        "sEnd": 462.0,
        "xCenter": 1019.8,
        "xOffset": 6.185,
        "lateralOffsets": [
          0.0
        ],
        "zLevel": -36.69,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N19",
        "role": "sup",
        "diamMm": 16.0,
        "count": 2,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 624.0,
        "reto": 547.0,
        "d1": 24.0,
        "d2": 60.0,
        "d1_confined": 22.4,
        "d2_confined": 22.4,
        "yStart": 5.2,
        "yEnd": 550.6,
        "sStart": 3.8,
        "sEnd": 549.2,
        "xCenter": 1019.8,
        "xOffset": 5.7,
        "lateralOffsets": [
          -5.7,
          5.7
        ],
        "zLevel": -13.8,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N1",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 15,
        "zonas": [
          {
            "vao": "P17-P13",
            "espacamento": 15.0,
            "count": 9,
            "start": 0.0,
            "end": 107.5
          },
          {
            "vao": "P13-P9",
            "espacamento": 15.0,
            "count": 6,
            "start": 107.5,
            "end": 173.0
          }
        ]
      }
    ]
  },
  "VB21": {
    "id": "VB21",
    "secao": {
      "b": 19.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "Y",
    "comprimentoTotal": 330.0,
    "apoios": [
      {
        "id": "P14",
        "x": 1190.2,
        "y": 254.4,
        "largura": 60.0
      },
      {
        "id": "P10",
        "x": 1190.2,
        "y": 474.4,
        "largura": 160.0
      }
    ],
    "prismBox": {
      "xMin": 1180.7,
      "xMax": 1199.7,
      "yMin": 224.4,
      "yMax": 554.4,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        1180.7,
        1199.7
      ],
      "y": [
        224.4,
        554.4
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N20",
        "role": "inf",
        "diamMm": 16.0,
        "count": 2,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 324.0,
        "reto": 300.0,
        "d1": 24.0,
        "d2": 0.0,
        "d1_confined": 22.4,
        "d2_confined": 0.0,
        "yStart": 228.2,
        "yEnd": 550.6,
        "sStart": 3.8,
        "sEnd": 326.2,
        "xCenter": 1190.2,
        "xOffset": 5.7,
        "lateralOffsets": [
          -5.7,
          5.7
        ],
        "zLevel": -36.2,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N20",
        "role": "sup",
        "diamMm": 16.0,
        "count": 2,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 324.0,
        "reto": 300.0,
        "d1": 24.0,
        "d2": 0.0,
        "d1_confined": 22.4,
        "d2_confined": 0.0,
        "yStart": 228.2,
        "yEnd": 528.2,
        "sStart": 3.8,
        "sEnd": 303.8,
        "xCenter": 1190.2,
        "xOffset": 5.7,
        "lateralOffsets": [
          -5.7,
          5.7
        ],
        "zLevel": -13.8,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N1",
        "diamMm": 5.0,
        "tipo": "simples",
        "largura": 13.0,
        "altura": 24.0,
        "comprimento": 85.0,
        "quantTotal": 12,
        "zonas": [
          {
            "vao": "P14-P10",
            "espacamento": 10.0,
            "count": 12,
            "start": 0.0,
            "end": 110.0
          }
        ]
      }
    ]
  },
  "VB22": {
    "id": "VB22",
    "secao": {
      "b": 40.0,
      "h": 30.0
    },
    "zTopo": -10.0,
    "eixo": "Y",
    "comprimentoTotal": 324.5,
    "apoios": [
      {
        "id": "P15",
        "x": 1711.2,
        "y": 259.9,
        "largura": 60.0
      },
      {
        "id": "P11",
        "x": 1711.2,
        "y": 474.4,
        "largura": 160.0
      }
    ],
    "prismBox": {
      "xMin": 1701.2,
      "xMax": 1741.2,
      "yMin": 229.9,
      "yMax": 554.4,
      "zMin": -40.0,
      "zMax": -10.0
    },
    "box": {
      "x": [
        1701.2,
        1741.2
      ],
      "y": [
        229.9,
        554.4
      ],
      "z": [
        -40.0,
        -10.0
      ]
    },
    "longitudinais": [
      {
        "id": "N15",
        "role": "inf",
        "diamMm": 12.5,
        "count": 4,
        "posicao": "Positivo corrido (1c)",
        "comprimento": 326.0,
        "reto": 319.0,
        "d1": 10.0,
        "d2": 0.0,
        "d1_confined": 10.0,
        "d2_confined": 0.0,
        "yStart": 233.53,
        "yEnd": 550.77,
        "sStart": 3.62,
        "sEnd": 320.88,
        "xCenter": 1721.2,
        "xOffset": 16.375,
        "lateralOffsets": [
          -16.375,
          -5.458,
          5.458,
          16.375
        ],
        "zLevel": -36.38,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": 1
        }
      },
      {
        "id": "N11",
        "role": "sup",
        "diamMm": 10.0,
        "count": 7,
        "posicao": "Porta-estribos corrido (1c)",
        "comprimento": 374.0,
        "reto": 319.0,
        "d1": 24.0,
        "d2": 36.0,
        "d1_confined": 23.0,
        "d2_confined": 23.0,
        "yStart": 233.4,
        "yEnd": 550.9,
        "sStart": 3.5,
        "sEnd": 321.0,
        "xCenter": 1721.2,
        "xOffset": 16.5,
        "lateralOffsets": [
          -16.5,
          -11.0,
          -5.5,
          0.0,
          5.5,
          11.0,
          16.5
        ],
        "zLevel": -13.5,
        "dir": {
          "x": 0,
          "y": 1,
          "z": 0
        },
        "wUp": {
          "x": 0,
          "y": 0,
          "z": -1
        }
      }
    ],
    "estribos": [
      {
        "id": "N2",
        "diamMm": 5.0,
        "tipo": "duplo",
        "largura": 23.0,
        "altura": 24.0,
        "comprimento": 105.0,
        "quantTotal": 16,
        "zonas": [
          {
            "vao": "P15-P11",
            "espacamento": 15.0,
            "count": 16,
            "start": 0.0,
            "end": 104.5
          }
        ]
      }
    ]
  }
};

  // Helper utility methods
  VIGAS_DATA.getBeam = function(id) {
    return this[id] || null;
  };

  VIGAS_DATA.getBeamIds = function() {
    return Object.keys(this).filter(k => k.startsWith('VB'));
  };

  VIGAS_DATA.getAllBeams = function() {
    return this.getBeamIds().map(id => this[id]);
  };

  // Exposição global compatível com Browser e Node.js
  if (typeof window !== 'undefined') {
    window.VIGAS_DATA = VIGAS_DATA;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VIGAS_DATA };
  }
  if (typeof global !== 'undefined') {
    global.VIGAS_DATA = VIGAS_DATA;
  }

})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this));
