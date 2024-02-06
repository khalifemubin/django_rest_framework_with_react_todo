from rest_framework import serializers
from todo.models import Todo


class TodoSerializer(serializers.ModelSerializer):
    created = serializers.ReadOnlyField()
    completed = serializers.ReadOnlyField()

    class Meta:
        model = Todo
        fields = ['id','title','memo','created','completed']
        extra_kwargs = {"title": {"required": False}, "memo": {"required": False}}



class TodoToggleCompleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields=['id']
        read_only_fields = ['title','memo','created','completed']