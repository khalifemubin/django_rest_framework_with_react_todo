from rest_framework import generics, permissions
from .serializers import TodoSerializer
from todo.models import Todo

# singup api starts
from django.db import IntegrityError
from django.contrib.auth.models import User
from rest_framework.parsers import JSONParser
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate

class TodoList(generics.ListAPIView):
    # ListAPIView requires two mandatory attributes, serializer_class and queryset.
    serializer_class = TodoSerializer

    def get_queryset(self):
        user = self.request.user
        return Todo.objects.filter(user=user).order_by('-created')
        # return Todo.objects.order_by('-created')


class TodoListCreate(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Todo.objects.filter(user=user).order_by('-created')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TodoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user= self.request.user
        return Todo.objects.filter(user=user)


class TodoToggleComplete(generics.UpdateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Todo.objects.filter(user=user)

    def perform_update(self, serializer):
        serializer.instance.completed = not(serializer.instance.completed)
        serializer.save()

@csrf_exempt
def signup(request):
    if request.method == 'POST':
        try:
            data = JSONParser().parse(request) #data is a dictonary
            user = User.objects.create_user(username=data['username'],password=data['password'])
            user.save()

            token = Token.objects.create(user=user)
            return JsonResponse({'token':str(token)},status=201)
        except IntegrityError:
            return JsonResponse({'error':'username taken. choose another username'},status=400)

@csrf_exempt
def login(request):
    if request.method == 'POST' or request.method == 'OPTIONS':
        data = JSONParser().parse(request)
        
        try:
            user = authenticate(request, username=data['username'],password=data['password'])
        except:
            return JsonResponse({'error':'invalid credentials'},status=400)

        if user is None:
            return JsonResponse({'error':'invalid credentials'},status=400)
        else:
            try:
                token = Token.objects.get(user=user)
            except:
                token = Token.objects.create(user=user)
            
            return JsonResponse({'token':str(token)},status=201)