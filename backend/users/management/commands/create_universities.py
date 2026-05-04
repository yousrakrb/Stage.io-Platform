from django.core.management.base import BaseCommand
import bcrypt
from users.models import User, AdministrationProfile
from datetime import datetime

class Command(BaseCommand):
    help = 'Create all Algerian university administration accounts'

    def handle(self, *args, **kwargs):
        universities = [
            {
                'full_name': 'Université Constantine 1 Mentouri',
                'email': 'administration@univ-constantine1.dz',
                'password': 'Constantine1Univ',
                'university': 'Université Constantine 1 Mentouri',
                'wilaya': 'Constantine',
            },
            {
                'full_name': 'Université Constantine 2 Abdelhamid Mehri',
                'email': 'administration@univ-constantine2.dz',
                'password': 'Constantine2Univ',
                'university': 'Université Constantine 2',
                'wilaya': 'Constantine',
            },
            {
                'full_name': 'Université Constantine 3',
                'email': 'administration@univ-constantine3.dz',
                'password': 'Constantine3Univ',
                'university': 'Université Constantine 3',
                'wilaya': 'Constantine',
            },
            {
                'full_name': 'Université Alger 1 Benyoucef Benkhedda',
                'email': 'administration@univ-alger1.dz',
                'password': 'Alger1Univ',
                'university': 'Université Alger 1',
                'wilaya': 'Alger',
            },
            {
                'full_name': 'Université Alger 2 Abou El Kacem Saadallah',
                'email': 'administration@univ-alger2.dz',
                'password': 'Alger2Univ',
                'university': 'Université Alger 2',
                'wilaya': 'Alger',
            },
            {
                'full_name': 'Université Alger 3',
                'email': 'administration@univ-alger3.dz',
                'password': 'Alger3Univ',
                'university': 'Université Alger 3',
                'wilaya': 'Alger',
            },
            {
                'full_name': 'Université Annaba Badji Mokhtar',
                'email': 'administration@univ-annaba.dz',
                'password': 'AnnabaUniv',
                'university': 'Université Annaba',
                'wilaya': 'Annaba',
            },
            {
                'full_name': 'Université Sétif 1 Ferhat Abbas',
                'email': 'administration@univ-setif1.dz',
                'password': 'Setif1Univ',
                'university': 'Université Sétif 1',
                'wilaya': 'Sétif',
            },
            {
                'full_name': 'Université Sétif 2',
                'email': 'administration@univ-setif2.dz',
                'password': 'Setif2Univ',
                'university': 'Université Sétif 2',
                'wilaya': 'Sétif',
            },
            {
                'full_name': 'Université Oran 1 Ahmed Ben Bella',
                'email': 'administration@univ-oran1.dz',
                'password': 'Oran1Univ',
                'university': 'Université Oran 1',
                'wilaya': 'Oran',
            },
            {
                'full_name': 'Université Oran 2 Mohamed Ben Ahmed',
                'email': 'administration@univ-oran2.dz',
                'password': 'Oran2Univ',
                'university': 'Université Oran 2',
                'wilaya': 'Oran',
            },
            {
                'full_name': 'Université Tlemcen Abou Bekr Belkaid',
                'email': 'administration@univ-tlemcen.dz',
                'password': 'TlemcenUniv',
                'university': 'Université Tlemcen',
                'wilaya': 'Tlemcen',
            },
            {
                'full_name': 'Université Blida 1 Saad Dahlab',
                'email': 'administration@univ-blida1.dz',
                'password': 'Blida1Univ',
                'university': 'Université Blida 1',
                'wilaya': 'Blida',
            },
            {
                'full_name': 'Université Blida 2 Lounici Ali',
                'email': 'administration@univ-blida2.dz',
                'password': 'Blida2Univ',
                'university': 'Université Blida 2',
                'wilaya': 'Blida',
            },
            {
                'full_name': 'Université Batna 1 Hadj Lakhdar',
                'email': 'administration@univ-batna1.dz',
                'password': 'Batna1Univ',
                'university': 'Université Batna 1',
                'wilaya': 'Batna',
            },
            {
                'full_name': 'Université Batna 2 Mostefa Ben Boulaïd',
                'email': 'administration@univ-batna2.dz',
                'password': 'Batna2Univ',
                'university': 'Université Batna 2',
                'wilaya': 'Batna',
            },
            {
                'full_name': 'Université Béjaïa Abderrahmane Mira',
                'email': 'administration@univ-bejaia.dz',
                'password': 'BejaiaUniv',
                'university': 'Université Béjaïa',
                'wilaya': 'Béjaïa',
            },
            {
                'full_name': 'Université Tizi Ouzou Mouloud Mammeri',
                'email': 'administration@univ-tiziouzou.dz',
                'password': 'TiziOuzouUniv',
                'university': 'Université Tizi Ouzou',
                'wilaya': 'Tizi Ouzou',
            },
            {
                'full_name': 'Université Jijel Mohamed Seddik Ben Yahia',
                'email': 'administration@univ-jijel.dz',
                'password': 'JijelUniv',
                'university': 'Université Jijel',
                'wilaya': 'Jijel',
            },
            {
                'full_name': 'Université Skikda 20 Août 1955',
                'email': 'administration@univ-skikda.dz',
                'password': 'SkikdaUniv',
                'university': 'Université Skikda',
                'wilaya': 'Skikda',
            },
            {
                'full_name': 'Université Guelma 8 Mai 1945',
                'email': 'administration@univ-guelma.dz',
                'password': 'GuelmaUniv',
                'university': 'Université Guelma',
                'wilaya': 'Guelma',
            },
            {
                'full_name': 'Université Médéa Yahia Fares',
                'email': 'administration@univ-medea.dz',
                'password': 'MedeaUniv',
                'university': 'Université Médéa',
                'wilaya': 'Médéa',
            },
            {
                'full_name': 'Université Mostaganem Abdelhamid Ibn Badis',
                'email': 'administration@univ-mostaganem.dz',
                'password': 'MostaganemUniv',
                'university': 'Université Mostaganem',
                'wilaya': 'Mostaganem',
            },
            {
                'full_name': 'Université Sidi Bel Abbès Djillali Liabes',
                'email': 'administration@univ-sba.dz',
                'password': 'SBAUniv',
                'university': 'Université Sidi Bel Abbès',
                'wilaya': 'Sidi Bel Abbès',
            },
            {
                'full_name': 'Ecole Nationale Supérieure Informatique ESI',
                'email': 'administration@esi.dz',
                'password': 'ESIUniv',
                'university': 'ESI Alger',
                'wilaya': 'Alger',
            },
            {
                'full_name': 'Ecole Nationale Polytechnique ENPA',
                'email': 'administration@enpa.dz',
                'password': 'ENPAUniv',
                'university': 'ENPA Alger',
                'wilaya': 'Alger',
            },
        ]

        created = 0
        skipped = 0

        for uni in universities:
            # check if already exists
            existing = User.objects(email=uni['email']).first()
            if existing:
                self.stdout.write(f"⚠️  Already exists: {uni['email']}")
                skipped += 1
                continue

            # hash password
            hashed_password = bcrypt.hashpw(
                uni['password'].encode('utf-8'),
                bcrypt.gensalt()
            ).decode('utf-8')

            # create user
            user = User(
                full_name=uni['full_name'],
                email=uni['email'],
                password=hashed_password,
                role='administration',
                phone='',
                student_type='',
                is_verified=True,
                verification_code='',
                created_at=datetime.now()
            )
            user.save()

            # create administration profile
            AdministrationProfile(
                user_id=str(user.id),
                university=uni['university'],
                wilaya=uni['wilaya'],
                location='',
                logo_url='',
                director_full_name='',
                director_email='',
                director_phone='',
            ).save()

            self.stdout.write(f"✅ Created: {uni['email']}")
            created += 1

        self.stdout.write(f"\n Done! Created: {created} | Skipped: {skipped}")