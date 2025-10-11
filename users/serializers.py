from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

User = get_user_model()

# ----------------------------
# Serializer para criação de usuário
# ----------------------------
class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializador para criar um novo usuário.
    Inclui validação de confirmação de senha.
    """
    password_confirmation = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password_confirmation', 'bio', 'avatar']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        """
        Valida se a senha e a confirmação de senha coincidem.
        """
        if data['password'] != data['password_confirmation']:
            raise serializers.ValidationError(
                {"password_confirmation": "As senhas não coincidem."})
        return data

    def create(self, validated_data):
        """
        Remove o campo password_confirmation e cria o usuário com a senha hashada.
        """
        validated_data.pop('password_confirmation')  # Remove a confirmação antes de criar
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],  # Hash automático no create_user
            bio=validated_data.get('bio', ''),
            avatar=validated_data.get('avatar', None)
        )


# ----------------------------
# Serializer para listar ou detalhar usuário
# ----------------------------
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'bio', 'avatar', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
            'avatar': {'required': False},
        }

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


# ----------------------------
# Serializer para atualização de perfil
# ----------------------------
class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    password_confirmation = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['email', 'bio', 'avatar', 'password', 'password_confirmation']

    def validate(self, data):
        pw = data.get('password')
        pw_conf = data.get('password_confirmation')
        if pw or pw_conf:
            if pw != pw_conf:
                raise serializers.ValidationError({"password_confirmation": "As senhas não coincidem."})
        return data

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        validated_data.pop('password_confirmation', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        if not email or not password:
            raise serializers.ValidationError({"detail": "Email e senha são obrigatórios"})

        user = authenticate(
            request=self.context.get("request"),
            username=email,  # ⚠️ Use username, Django vai usar USERNAME_FIELD=email
            password=password
        )

        # user = authenticate(self.context.get("request"), email=email, password=password)
        if not user:
            raise serializers.ValidationError({"detail": "Credenciais inválidas"})

        data = super().validate(attrs)
        data['user'] = {
            "id": user.id,
            "email": user.email,
            "bio": getattr(user, "bio", ""),
            "avatar": user.avatar.url if getattr(user, "avatar", None) else None
        }
        return data

# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     username_field = 'email'

#     def validate(self, attrs):
#         email = attrs.get("email")
#         password = attrs.get("password")

#         if email and password:
#             user = authenticate(request=self.context.get("request"),
#                                 email=email, password=password)
#             if not user:
#                 raise serializers.ValidationError("Credenciais inválidas")
#         else:
#             raise serializers.ValidationError("Email e senha são obrigatórios")

#         data = super().validate(attrs)
#         data['user'] = {
#             "id": self.user.id,
#             "email": self.user.email,
#             "bio": getattr(self.user, "bio", ""),
#             "avatar": self.user.avatar.url if getattr(self.user, "avatar", None) else None
#         }
#         return data