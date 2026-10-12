/* Monalisa Electro Make: product catalog.
   To add a new product, copy one block below and change every field.
   "id" must be unique and URL-safe (used as product.html?id=...). */
window.PRODUCTS = [
    {
        id: 'bus-bar',
        category: 'Bus Bar',
        initials: 'BB',
        image: 'busbar.jpg',
        name: 'Aluminium & Copper Bus Bar',
        tagline: 'Low-loss power distribution for panels and switchgear',
        description:
            'Custom-fabricated bus bars for power distribution inside LT and HT panels, switchgear and industrial control boards. Built to your load, current rating and panel layout.',
        specs: [
            ['Material', 'Aluminium or electrolytic copper'],
            ['Current rating', '100A to 6300A'],
            ['Insulation', 'PVC heat-shrink sleeve or epoxy coating'],
            ['Finish', 'Tin, silver or nickel plating available'],
            ['Standard', 'Built to IS 5082 and IEC 61439'],
            ['Custom sizing', 'Made to your drawing or panel specification'],
        ],
    },
    {
        id: 'cable-box',
        category: 'Cable Box',
        initials: 'CB',
        name: 'Cable Junction & Trunking Box',
        tagline: 'Safe cable termination and routing enclosures',
        description:
            'Weatherproof and indoor cable junction boxes for joining, branching and protecting power and control cables on site, sized to the cable count and gland layout you need.',
        specs: [
            ['Material', 'Mild steel, GI sheet or FRP'],
            ['IP rating', 'IP55 to IP65'],
            ['Size range', '150x150mm to 1000x1000mm, custom sizes available'],
            ['Mounting', 'Wall mount, floor mount or pole mount'],
            ['Finish', 'Powder coated'],
            ['Use', 'Indoor and outdoor cable management'],
        ],
    },
    {
        id: 'transformer-box',
        category: 'Transformer Box',
        initials: 'TB',
        name: 'Transformer Enclosure / Box',
        tagline: 'Enclosures built around your transformer capacity',
        description:
            'Ventilated, weatherproof enclosures for distribution transformers. Sized to protect the unit and give safe access for maintenance and inspection.',
        specs: [
            ['Capacity range', '25 kVA to 2500 kVA enclosures'],
            ['Material', 'MS sheet, powder coated'],
            ['Ventilation', 'Louvers with mesh guard'],
            ['Access', 'Lockable doors and inspection panels'],
            ['Mounting', 'Plinth mount or skid mount'],
            ['Sizing', 'Built to your site and load requirement'],
        ],
    },
    {
        id: 'light-lamp',
        category: 'Light / Lamp',
        initials: 'LL',
        name: 'LED Industrial & Commercial Light',
        tagline: 'Lighting for warehouses, hotels and offices',
        description:
            'LED fixtures for industrial sheds, commercial spaces and hospitality projects. Supplied on their own or as part of a full lighting installation.',
        specs: [
            ['Wattage range', '9W to 200W'],
            ['Lumen output', 'Up to 150 lumens per watt'],
            ['IP rating', 'IP20 indoor to IP65 outdoor'],
            ['Fitting type', 'B22, E27, surface, panel or high-bay'],
            ['Colour temperature', '3000K to 6500K options'],
            ['Warranty', '1 to 2 years depending on model'],
        ],
    },
];
