import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  Header,
  Footer,
  PageNumber
} from 'docx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ActaData } from '../types';

/**
 * Downloads a Blob in the browser with the given filename
 */
function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports the complete Acta to a genuine Microsoft Word (.docx) file
 */
export async function exportToWord(data: ActaData, usePlaceholders: boolean = false): Promise<void> {
  const val = (actual: string, placeholder: string) => (usePlaceholders ? `[${placeholder}]` : actual);

  const tableBorderNone = {
    top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' }
  };

  const tableBorderThin = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'CBD5E1' }
  };

  // 1. Logistics Table Rows
  const logisticsHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 28, type: WidthType.PERCENTAGE },
        shading: { fill: '0F172A' },
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'Parámetro', bold: true, color: 'FFFFFF', size: 19 })]
          })
        ]
      }),
      new TableCell({
        width: { size: 38, type: WidthType.PERCENTAGE },
        shading: { fill: '0F172A' },
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'Detalle Concertado', bold: true, color: 'FFFFFF', size: 19 })]
          })
        ]
      }),
      new TableCell({
        width: { size: 34, type: WidthType.PERCENTAGE },
        shading: { fill: '0F172A' },
        children: [
          new Paragraph({
            children: [new TextRun({ text: 'Observaciones Comunitarias', bold: true, color: 'FFFFFF', size: 19 })]
          })
        ]
      })
    ]
  });

  const logisticsDataRows = data.logistics.map((log, idx) => {
    const isEven = idx % 2 === 0;
    const bgFill = isEven ? 'FFFFFF' : 'F8FAFC';
    return new TableRow({
      children: [
        new TableCell({
          shading: { fill: bgFill },
          children: [
            new Paragraph({
              children: [new TextRun({ text: val(log.parameter, log.parameter), bold: true, size: 18 })]
            })
          ]
        }),
        new TableCell({
          shading: { fill: bgFill },
          children: [
            new Paragraph({
              children: [new TextRun({ text: val(log.agreedDetail, `Detalle de ${log.parameter}`), size: 18 })]
            })
          ]
        }),
        new TableCell({
          shading: { fill: bgFill },
          children: [
            new Paragraph({
              children: [new TextRun({ text: val(log.communityObservations, 'Observación comunitaria'), italics: true, size: 18, color: '475569' })]
            })
          ]
        })
      ]
    });
  });

  const docLogisticsTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [logisticsHeaderRow, ...logisticsDataRows]
  });

  // 2. Signatures Table Rows
  const signaturesHeaderRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 8, type: WidthType.PERCENTAGE },
        shading: { fill: '0F172A' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'N°', bold: true, color: 'FFFFFF', size: 18 })] })]
      }),
      new TableCell({
        width: { size: 44, type: WidthType.PERCENTAGE },
        shading: { fill: '0F172A' },
        children: [new Paragraph({ children: [new TextRun({ text: 'Nombre Completo del Aprendiz', bold: true, color: 'FFFFFF', size: 18 })] })]
      }),
      new TableCell({
        width: { size: 26, type: WidthType.PERCENTAGE },
        shading: { fill: '0F172A' },
        children: [new Paragraph({ children: [new TextRun({ text: 'Tipo y N° Documento', bold: true, color: 'FFFFFF', size: 18 })] })]
      }),
      new TableCell({
        width: { size: 22, type: WidthType.PERCENTAGE },
        shading: { fill: '0F172A' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Firma o Huella', bold: true, color: 'FFFFFF', size: 18 })] })]
      })
    ]
  });

  const signaturesDataRows = data.learners.map((learner, idx) => {
    const isEven = idx % 2 === 0;
    const bgFill = isEven ? 'FFFFFF' : 'F8FAFC';
    const minorNote = learner.isMinor ? ` (Menor 14+ años - Acudiente: ${learner.guardianName || 'Ver registro'})` : '';
    const signText = learner.signatureType === 'huella' ? '[Huella Registrada]' : (learner.signatureType === 'firma' ? '[Firma Registrada]' : '[Pendiente]');

    return new TableRow({
      children: [
        new TableCell({
          shading: { fill: bgFill },
          children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${learner.number}`, bold: true, size: 18 })] })]
        }),
        new TableCell({
          shading: { fill: bgFill },
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: learner.fullName, bold: true, size: 18 }),
                new TextRun({ text: minorNote, italics: true, size: 16, color: 'B45309' })
              ]
            })
          ]
        }),
        new TableCell({
          shading: { fill: bgFill },
          children: [
            new Paragraph({
              children: [new TextRun({ text: `${learner.documentType} ${learner.documentNumber}`, size: 18, font: 'Consolas' })]
            })
          ]
        }),
        new TableCell({
          shading: { fill: bgFill },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: signText,
                  bold: true,
                  size: 16,
                  color: learner.signatureType === 'huella' ? 'B45309' : '047857'
                })
              ]
            })
          ]
        })
      ]
    });
  });

  const docSignaturesTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [signaturesHeaderRow, ...signaturesDataRows]
  });

  // Create the Word Document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({ text: 'REPÚBLICA DE COLOMBIA • DESARROLLO COMUNITARIO RURAL • ', size: 16, color: '64748B' }),
                  new TextRun({ text: val(data.actCode, 'CÓDIGO DE ACTA'), bold: true, size: 16, color: '0F172A' })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({ text: 'Página ', size: 16, color: '64748B' }),
                  new TextRun({ children: [PageNumber.CURRENT], size: 16, color: '64748B' }),
                  new TextRun({ text: ' de ', size: 16, color: '64748B' }),
                  new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 16, color: '64748B' }),
                  new TextRun({ text: ' — Acta Formal de Concertación y Compromiso Comunitario', size: 16, color: '64748B' })
                ]
              })
            ]
          })
        },
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: val(data.entityName, 'NOMBRE DE LA ENTIDAD FORMATIVA'),
                bold: true,
                size: 26,
                color: '0F172A'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: val(data.programName, 'PROGRAMA DE FORMACIÓN'),
                bold: true,
                size: 20,
                color: '065F46'
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: 'ACTA FORMAL DE CONCERTACIÓN Y COMPROMISO COMUNITARIO',
                bold: true,
                size: 24,
                color: '1E293B',
                underline: {}
              })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({ text: 'Acción Formativa: ', bold: true, size: 20 }),
              new TextRun({ text: val(data.trainingCourseName, 'NOMBRE DEL CURSO'), bold: true, size: 20, color: '047857' })
            ]
          }),

          // 1. Objetivo General
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [new TextRun({ text: '1. ENCABEZADO INSTITUCIONAL Y OBJETIVO GENERAL', bold: true, size: 22, color: '065F46' })]
          }),
          new Paragraph({
            spacing: { after: 200 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: 'En el marco de la estrategia de democratización del conocimiento y cierre de brechas digitales en los territorios rurales, se suscribe la presente Acta de Concertación y Compromiso Comunitario con el fin de formalizar los acuerdos pedagógicos, humanos y logísticos entre la entidad formadora y los habitantes de la comunidad.\n\n',
                size: 20
              }),
              new TextRun({ text: 'Objetivo General Concertado: ', bold: true, size: 20 }),
              new TextRun({ text: val(data.generalObjective, 'OBJETIVO GENERAL DE LA CAPACITACIÓN'), size: 20 })
            ]
          }),

          // 2. Datos Generales de Concertación
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [new TextRun({ text: '2. DATOS GENERALES DE CONCERTACIÓN TERRITORIAL', bold: true, size: 22, color: '065F46' })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '• Departamento / Municipio: ', bold: true, size: 20 }),
              new TextRun({ text: `${val(data.department, 'DEPARTAMENTO')} / ${val(data.municipality, 'MUNICIPIO')}`, size: 20 })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '• Vereda / Caserío / Localidad: ', bold: true, size: 20 }),
              new TextRun({ text: val(data.locality, 'VEREDA O LOCALIDAD'), size: 20, color: '047857', bold: true })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '• Sede Física Concertada: ', bold: true, size: 20 }),
              new TextRun({ text: val(data.meetingPlace, 'SEDE FÍSICA / SALÓN COMUNAL'), size: 20 })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '• Día y Franja Horaria: ', bold: true, size: 20 }),
              new TextRun({ text: `${val(data.sessionDay, 'DÍA')} de ${val(data.sessionTime, 'HORARIO')}`, size: 20 })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '• Frecuencia de Encuentros: ', bold: true, size: 20 }),
              new TextRun({ text: val(data.frequencyText, 'FRECUENCIA SEMANAL CADA 8 DÍAS'), size: 20 })
            ]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: '• Facilitador(a) a Cargo: ', bold: true, size: 20 }),
              new TextRun({ text: `${val(data.facilitatorName, 'FACILITADOR/A')} (${val(data.facilitatorRole, 'CARGO')} - ${val(data.facilitatorDocument, 'DOCUMENTO')})`, size: 20 })
            ]
          }),
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({ text: '• Representante Comunitario: ', bold: true, size: 20 }),
              new TextRun({ text: `${val(data.communityLeaderName, 'LÍDER JAC')} (${val(data.communityLeaderRole, 'CARGO')})`, size: 20 })
            ]
          }),

          // 3. Tabla Logística
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [new TextRun({ text: '3. TABLA DE LOGÍSTICA Y CRONOGRAMA CONCERTADO', bold: true, size: 22, color: '065F46' })]
          }),
          docLogisticsTable,

          // 4. Condiciones Metodológicas
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 150 },
            children: [new TextRun({ text: '4. CONDICIONES Y ACUERDOS METODOLÓGICOS', bold: true, size: 22, color: '065F46' })]
          }),
          new Paragraph({
            spacing: { after: 150 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: '4.1. Cupo Mínimo Obligatorio: ', bold: true, size: 20 }),
              new TextRun({
                text: `Se establece un cupo mínimo de ${data.minLearners} aprendices registrados y activos para la viabilidad de la capacitación. Actualmente se cuenta con ${data.learners.length} participantes registrados. La comunidad velará solidariamente por la permanencia activa.\n\n`,
                size: 20
              }),
              new TextRun({ text: '4.2. Participación de Menores (14 a 17 años): ', bold: true, size: 20 }),
              new TextRun({ text: `${val(data.youthPolicyText, 'POLÍTICA DE MENORES')}\n\n`, size: 20 }),
              new TextRun({ text: '4.3. Herramientas Digitales y Brecha Rural: ', bold: true, size: 20 }),
              new TextRun({ text: `${val(data.connectivityNotes, 'NOTAS OFFLINE')}`, size: 20 })
            ]
          }),

          // 5. Compromisos Mutuos
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [new TextRun({ text: '5. COMPROMISOS MUTUOS DE LAS PARTES', bold: true, size: 22, color: '065F46' })]
          }),
          new Paragraph({
            spacing: { after: 100 },
            children: [new TextRun({ text: '5.1. De la Entidad Formativa y Facilitador(a):', bold: true, size: 20, color: '047857' })]
          }),
          ...data.facilitatorCommitments.map(
            (c, i) =>
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: `${i + 1}. `, bold: true, size: 19 }),
                  new TextRun({ text: val(c, `Compromiso facilitador ${i + 1}`), size: 19 })
                ]
              })
          ),
          new Paragraph({
            spacing: { before: 150, after: 100 },
            children: [new TextRun({ text: '5.2. De los Aprendices y la Comunidad Rural:', bold: true, size: 20, color: 'B45309' })]
          }),
          ...data.communityCommitments.map(
            (c, i) =>
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({ text: `${i + 1}. `, bold: true, size: 19 }),
                  new TextRun({ text: val(c, `Compromiso comunidad ${i + 1}`), size: 19 })
                ]
              })
          ),

          // 6. Veredicto Final
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 150 },
            children: [new TextRun({ text: '6. VEREDICTO FINAL Y DECLARATORIA DE ACEPTACIÓN', bold: true, size: 22, color: '065F46' })]
          }),
          new Paragraph({
            spacing: { after: 300 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({ text: val(data.finalVerdictText, 'DECLARATORIA DE CONFORMIDAD MUTUA'), italics: true, size: 20 }),
              new TextRun({
                text: `\n\nSuscrita en la Vereda ${val(data.locality, 'VEREDA')}, Municipio de ${val(data.municipality, 'MUNICIPIO')}, el día ${new Date().toLocaleDateString('es-CO')}.`,
                size: 20
              })
            ]
          }),

          // 7. Firmas Table
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: `7. REGISTRO, FIRMAS Y HUELLAS DACTILARES (${data.learners.length} APRENDICES)`,
                bold: true,
                size: 22,
                color: '065F46'
              })
            ]
          }),
          docSignaturesTable,

          // Cierre y firmas finales
          new Paragraph({
            spacing: { before: 600, after: 300 },
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: '________________________________________               ________________________________________\n', bold: true }),
              new TextRun({ text: `${val(data.facilitatorName, 'FACILITADOR/A')}                             ${val(data.communityLeaderName, 'LÍDER JAC')}\n`, bold: true, size: 20 }),
              new TextRun({ text: `Por la Entidad Formativa                                 Por la Comunidad Rural`, size: 18, color: '64748B' })
            ]
          })
        ]
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const safeFilename = `Acta_Concertacion_${data.locality.replace(/\s+/g, '_')}_2026.docx`;
  downloadBlob(blob, safeFilename);
}

/**
 * Exports the rendered document DOM element to a professional PDF file using html2canvas & jsPDF
 */
export async function exportToPdf(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Elemento #${elementId} no encontrado en el DOM`);
  }

  // Clone or prepare for canvas capture with high DPI
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff'
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
  
  // Calculate A4 dimensions in mm
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pdfHeight;

  // Multi-page handling
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;
  }

  pdf.save(filename);
}
