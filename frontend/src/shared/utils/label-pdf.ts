import jsPDF from 'jspdf';

export async function printOrderLabels(orders: any[]) {
  const doc = new jsPDF({
    orientation: 'portrait',

    unit: 'mm',

    format: [101.6, 152.4],
  });

  const PAGE_HEIGHT = 152.4;

  const START_Y = 24;

  const BOTTOM_LIMIT = 120;

  orders.forEach((order: any, index: number) => {
    if (index > 0) {
      doc.addPage();
    }

    const specialItems = order.items.filter((item: any) =>
      ['Baguette'].includes(item.product.name),
    );

    const drawHeader = () => {
      doc.setFont('helvetica', 'bold');

      doc.setFontSize(18);

      doc.text(order.customer?.name || 'Unbekannt', 8, 14);

      doc.addImage('/logo.png', 'PNG', 80, 4, 12, 12);

      doc.setLineWidth(0.5);

      doc.line(8, 18, 94, 18);
    };

    drawHeader();

    let y = START_Y;

    doc.setFont('helvetica', 'normal');

    doc.setFontSize(11);

    order.items.forEach((item: any) => {
      // Seitenumbruch
      if (y > BOTTOM_LIMIT) {
        doc.addPage();

        drawHeader();

        y = START_Y;
      }

      const itemTotal = (item.quantity * Number(item.unitPrice)).toFixed(2);

      doc.text(`${item.quantity}x ${item.product.name}`, 8, y);

      doc.text(`${itemTotal} €`, 94, y, {
        align: 'right',
      });

      y += 7;
    });

    // Linie
    y += 2;

    if (y > BOTTOM_LIMIT) {
      doc.addPage();

      drawHeader();

      y = START_Y;
    }

    doc.setLineWidth(0.5);

    doc.line(8, y, 94, y);

    // Gesamtpreis
    y += 8;

    const total = order.items.reduce(
      (sum: number, item: any) => sum + item.quantity * Number(item.unitPrice),

      0,
    );

    doc.setFont('helvetica', 'bold');

    doc.setFontSize(13);

    doc.text('Gesamt:', 8, y);

    doc.text(`${total.toFixed(2)} €`, 94, y, {
      align: 'right',
    });

    // Spezialbox
    if (specialItems.length) {
      y += 12;

      const specialHeight = 20 + specialItems.length * 6;

      // Falls Spezialbox nicht mehr draufpasst
      if (y + specialHeight > PAGE_HEIGHT - 10) {
        doc.addPage();

        drawHeader();

        y = START_Y;
      }

      doc.setDrawColor(0);

      doc.setLineWidth(0.8);

      doc.rect(8, y, 86, specialHeight);

      doc.setFont('helvetica', 'bold');

      doc.setFontSize(12);

      doc.text('BITTE BESONDERS BEACHTEN', 51, y + 8, {
        align: 'center',
      });

      doc.setFont('helvetica', 'normal');

      doc.setFontSize(11);

      let specialY = y + 16;

      specialItems.forEach((item: any) => {
        doc.text(`${item.quantity}x ${item.product.name}`, 51, specialY, {
          align: 'center',
        });

        specialY += 5;
      });
    }
  });

  doc.autoPrint();

  window.open(doc.output('bloburl'));
}
