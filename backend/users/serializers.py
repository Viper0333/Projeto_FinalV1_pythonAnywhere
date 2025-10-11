from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


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
        validated_data.pop(
            'password_confirmation')  # Remove a confirmação antes de criar
        return User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],  # Hash automático no create_user
            bio=validated_data.get('bio', ''),
            avatar=validated_data.get('avatar', None)
        )


class UserSerializer(serializers.ModelSerializer):
    """
    Serializador para listar ou detalhar informações de um usuário.
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'bio', 'avatar']
