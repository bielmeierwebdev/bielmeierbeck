import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.customer.createMany({
    data: [
      {
        name: 'Anna Müller',
        phone: '017612345001',
        address: 'Hauptstraße 12, München',
      },
      {
        name: 'Max Schneider',
        phone: '017612345002',
        address: 'Bahnhofstraße 8, Augsburg',
      },
      {
        name: 'Julia Weber',
        phone: '017612345003',
        address: 'Marktplatz 5, Nürnberg',
      },
      {
        name: 'Lukas Fischer',
        phone: '017612345004',
        address: 'Lindenweg 3, Regensburg',
      },
      {
        name: 'Sophie Bauer',
        phone: '017612345005',
        address: 'Kirchstraße 17, Passau',
      },
      {
        name: 'Daniel Hoffmann',
        phone: '017612345006',
        address: 'Gartenstraße 22, Ulm',
      },
      {
        name: 'Marie Klein',
        phone: '017612345007',
        address: 'Bergweg 4, Ingolstadt',
      },
      {
        name: 'Leon Richter',
        phone: '017612345008',
        address: 'Schillerstraße 11, Würzburg',
      },
      {
        name: 'Laura Wolf',
        phone: '017612345009',
        address: 'Mozartweg 14, Rosenheim',
      },
      {
        name: 'Paul Neumann',
        phone: '017612345010',
        address: 'Feldstraße 6, Landshut',
      },
      {
        name: 'Nina Schwarz',
        phone: '017612345011',
        address: 'Seestraße 19, Kempten',
      },
      {
        name: 'Tim Wagner',
        phone: '017612345012',
        address: 'Am Park 7, Bamberg',
      },
      {
        name: 'Vanessa Beck',
        phone: '017612345013',
        address: 'Bäckerweg 2, Dachau',
      },
      {
        name: 'Florian Hartmann',
        phone: '017612345014',
        address: 'Ringstraße 31, Erlangen',
      },
      {
        name: 'Sarah Lang',
        phone: '017612345015',
        address: 'Sonnenweg 9, Fürth',
      },
      {
        name: 'Fabian Keller',
        phone: '017612345016',
        address: 'Talstraße 27, Memmingen',
      },
      {
        name: 'Lisa Krüger',
        phone: '017612345017',
        address: 'Rosenstraße 18, Freising',
      },
      {
        name: 'Jonas Zimmermann',
        phone: '017612345018',
        address: 'Postweg 1, Straubing',
      },
      {
        name: 'Clara Sommer',
        phone: '017612345019',
        address: 'Eichenweg 16, Coburg',
      },
      {
        name: 'David Braun',
        phone: '017612345020',
        address: 'Wiesenstraße 13, Hof',
      },
    ],
  });

  console.log('Seed erfolgreich 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
