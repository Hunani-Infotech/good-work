import json

with open('src/data/site.json', 'r', encoding='utf-8') as f:
    d = json.load(f)

P = 'https://picsum.photos/seed'

# Profile photo
d['home']['hero']['profilePhoto'] = 'https://randomuser.me/api/portraits/men/47.jpg'

# Video CV
d['home']['hero']['videoCv'] = {
    'src': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'poster': P + '/video-cv-sanjay/800/450',
    'link': 'https://goodwork.asia'
}

# Services items with unique Picsum images per item
d['home']['services']['items'] = [
    {
        'id': 'mobile-engineering',
        'title': 'Mobile engineering',
        'description': 'Led an Android development team to deliver and maintain multiple large-scale software projects, improving development velocity by modularizing legacy codebases into modern architectural standards.',
        'media': [
            {'type': 'image', 'src': P + '/android-team1/900/1200'},
            {'type': 'image', 'src': P + '/android-team2/900/1200'},
            {'type': 'image', 'src': P + '/mobile-ui1/900/1200'},
            {'type': 'image', 'src': P + '/kotlin-dev1/900/1200'},
            {'type': 'image', 'src': P + '/android-ui2/900/1200'},
        ]
    },
    {
        'id': 'pos-ticketing',
        'title': 'Transport & POS systems',
        'description': 'Deployed a scalable POS Bus Ticketing Solution across 4 major metropolitan areas by integrating custom SDKs and core Java SQLite databases, enabling real-time fare calculations and automated reporting.',
        'media': [
            {'type': 'image', 'src': P + '/pos-system1/900/1200'},
            {'type': 'image', 'src': P + '/transit-kl1/900/1200'},
            {'type': 'image', 'src': P + '/bus-tech1/900/1200'},
            {'type': 'image', 'src': P + '/sqlite-pos/900/1200'},
            {'type': 'image', 'src': P + '/fare-calc1/900/1200'},
        ]
    },
    {
        'id': 'bluetooth-hardware',
        'title': 'Hardware integration',
        'description': 'Engineered a cross-platform dairy management application deployed on Play Store and App Store, eliminating manual entry by integrating Bluetooth sockets with external DPU hardware.',
        'media': [
            {'type': 'image', 'src': P + '/bluetooth-hw1/900/1200'},
            {'type': 'image', 'src': P + '/flutter-app1/900/1200'},
            {'type': 'image', 'src': P + '/dpu-device1/900/1200'},
            {'type': 'image', 'src': P + '/crossplatform1/900/1200'},
            {'type': 'image', 'src': P + '/playstore1/900/1200'},
        ]
    },
    {
        'id': 'offline-first',
        'title': 'Offline-first architecture',
        'description': 'Ensured zero data loss during network outages by designing an offline-first data storage system using SQLite, enabling seamless asynchronous cloud synchronization upon network restoration.',
        'media': [
            {'type': 'image', 'src': P + '/offline-arch1/900/1200'},
            {'type': 'image', 'src': P + '/cloud-sync1/900/1200'},
            {'type': 'image', 'src': P + '/sqlite-db1/900/1200'},
            {'type': 'image', 'src': P + '/network-res1/900/1200'},
            {'type': 'image', 'src': P + '/async-sync1/900/1200'},
        ]
    },
]

# Work projects with unique diverse Picsum images
d['work']['projects'] = [
    {
        'id': 'bus-ticketing',
        'titleLine1': 'POS Bus Ticketing',
        'titleLine2': 'Cross-City Transport Solution',
        'year': '2024',
        'challenge': 'Deploy a scalable point-of-sale ticketing system across 4 major metropolitan areas requiring real-time fare calculations and offline resilience.',
        'role': 'Led full Android development, integrating custom SDKs and core Java SQLite databases for automated reporting and real-time fare synchronization.',
        'services': ['Android Development', 'SDK Integration', 'SQLite Architecture'],
        'liveUrl': None,
        'liveCtaLabel': None,
        'navLabel': 'Bus Ticketing',
        'navThumb': P + '/bustick-nav/600/400',
        'galleryLayoutClass': 'maps',
        'media': [
            {'type': 'image', 'src': P + '/bustick-cover/1600/900', 'variant': 'default'},
            {'type': 'image', 'src': P + '/bustick-s1/900/1200', 'variant': 'small'},
            {'type': 'image', 'src': P + '/bustick-s2/900/1200', 'variant': 'small'},
            {'type': 'image', 'src': P + '/bustick-d1/1600/900', 'variant': 'default'},
            {'type': 'image', 'src': P + '/bustick-d2/1600/900', 'variant': 'default'},
        ]
    },
    {
        'id': 'dairy-app',
        'titleLine1': 'Dairy Management',
        'titleLine2': 'Cross-Platform Mobile App',
        'year': '2023',
        'challenge': 'Eliminate manual data entry for dairy operations by connecting mobile devices directly to external DPU hardware via Bluetooth sockets.',
        'role': 'Engineered cross-platform Flutter app for Play Store and App Store with full Bluetooth socket integration to external DPU hardware.',
        'services': ['Flutter / Dart', 'Bluetooth Integration', 'Play Store & App Store'],
        'liveUrl': None,
        'liveCtaLabel': None,
        'navLabel': 'Dairy App',
        'navThumb': P + '/dairy-nav/600/400',
        'galleryLayoutClass': 'ai-google',
        'media': [
            {'type': 'image', 'src': P + '/dairy-cover/1600/900', 'variant': 'default'},
            {'type': 'image', 'src': P + '/dairy-s1/900/1200', 'variant': 'small'},
            {'type': 'image', 'src': P + '/dairy-s2/900/1200', 'variant': 'small'},
            {'type': 'image', 'src': P + '/dairy-d1/1600/900', 'variant': 'default'},
            {'type': 'image', 'src': P + '/dairy-d2/1600/900', 'variant': 'default'},
        ]
    },
    {
        'id': 'offline-sync',
        'titleLine1': 'Offline-First',
        'titleLine2': 'Data Sync Platform',
        'year': '2023',
        'challenge': 'Ensure zero data loss during network outages for enterprise mobile apps operating across low-connectivity field environments.',
        'role': 'Designed an offline-first SQLite storage system that enables seamless asynchronous cloud synchronization upon network restoration.',
        'services': ['SQLite Architecture', 'Cloud Sync', 'Android / iOS'],
        'liveUrl': None,
        'liveCtaLabel': None,
        'navLabel': 'Offline Sync',
        'navThumb': P + '/offlinesync-nav/600/400',
        'galleryLayoutClass': '_1000',
        'media': [
            {'type': 'image', 'src': P + '/offlinesync-cover/1600/900', 'variant': 'default'},
            {'type': 'image', 'src': P + '/offlinesync-s1/900/1200', 'variant': 'small'},
            {'type': 'image', 'src': P + '/offlinesync-s2/900/1200', 'variant': 'small'},
            {'type': 'image', 'src': P + '/offlinesync-d1/1600/900', 'variant': 'default'},
            {'type': 'image', 'src': P + '/offlinesync-d2/1600/900', 'variant': 'default'},
        ]
    },
    {
        'id': 'enterprise-android',
        'titleLine1': 'Enterprise Android',
        'titleLine2': 'Modular Architecture',
        'year': '2022',
        'challenge': 'Scale and modernise legacy Android codebases for multiple large-scale enterprise clients without disrupting ongoing production releases.',
        'role': 'Led Android development team to improve velocity by refactoring monolithic codebases into clean, modular architectural standards.',
        'services': ['Android Lead', 'Kotlin', 'Jetpack Compose'],
        'liveUrl': None,
        'liveCtaLabel': None,
        'navLabel': 'Enterprise Android',
        'navThumb': P + '/enterprise-nav/600/400',
        'galleryLayoutClass': 'rappi',
        'media': [
            {'type': 'image', 'src': P + '/enterprise-cover/1600/900', 'variant': 'default'},
            {'type': 'image', 'src': P + '/enterprise-s1/900/1200', 'variant': 'small'},
            {'type': 'image', 'src': P + '/enterprise-s2/900/1200', 'variant': 'small'},
            {'type': 'image', 'src': P + '/enterprise-d1/1600/900', 'variant': 'default'},
            {'type': 'image', 'src': P + '/enterprise-d2/1600/900', 'variant': 'default'},
        ]
    },
]

# Remove legacy external UI asset references
d['site']['assets']['videoPosterHome'] = P + '/video-poster-home/800/450'
d['site']['assets']['folderFront'] = ''
d['site']['assets']['folderProjects'] = ''
d['site']['assets']['folderBack'] = ''

with open('src/data/site.json', 'w', encoding='utf-8') as f:
    json.dump(d, f, indent=2, ensure_ascii=False)

print('Done')
