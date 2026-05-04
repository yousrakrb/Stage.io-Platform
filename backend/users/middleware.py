from rest_framework_simplejwt.tokens import AccessToken
from .models import User

def get_user_from_token(request):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        decoded = AccessToken(token)
        user_id = decoded['user_id']

        user = User.objects(id=user_id).first()
        return user
    
    except: 
        return None
    