import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodoText, setEditedTodoText] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('@todos');
      if (storedTodos !== null) {
        setTodos(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  };

  const saveTodos = async (updatedTodos) => {
    try {
      await AsyncStorage.setItem('@todos', JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      const updatedTodos = [...todos, { id: Date.now(), text: newTodo, completed: false }];
      setNewTodo('');
      saveTodos(updatedTodos);
    }
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    saveTodos(updatedTodos);
  };

  const handleEditTodo = (id, text) => {
    setEditingTodoId(id);
    setEditedTodoText(text);
  };

  const handleSaveEditedTodo = () => {
    if (editedTodoText.trim() !== '') {
      const updatedTodos = todos.map(todo =>
        todo.id === editingTodoId ? { ...todo, text: editedTodoText } : todo
      );
      saveTodos(updatedTodos);
      setEditingTodoId(null);
      setEditedTodoText('');
    }
  };

  const handleMarkCompleted = (id) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(updatedTodos);
  };

  const renderTodoItem = ({ item }) => (
    <Swipeable
      renderLeftActions={() => (
        <TouchableOpacity onPress={() => handleMarkCompleted(item.id)}>
          <View style={styles.completeButton}>
            <Text style={styles.completeButtonText}>{item.completed ? 'Uncomplete' : 'Complete'}</Text>
          </View>
        </TouchableOpacity>
      )}
      renderRightActions={() => (
        <TouchableOpacity onPress={() => handleEditTodo(item.id, item.text)}>
          <View style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </View>
        </TouchableOpacity>
      )}
    >
      <View style={styles.todoItem}>
        {editingTodoId === item.id ? (
          <View style={styles.editTodoContainer}>
            <TextInput
              style={styles.editTextInput}
              value={editedTodoText}
              onChangeText={text => setEditedTodoText(text)}
            />
            <TouchableOpacity onPress={handleSaveEditedTodo}>
              <View style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={[styles.todoText, item.completed && styles.completedTodoText]}>
            {item.text}
          </Text>
        )}
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Todo App</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new todo..."
        value={newTodo}
        onChangeText={text => setNewTodo(text)}
      />
      <TouchableOpacity onPress={handleAddTodo} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Todo</Text>
      </TouchableOpacity>
      <FlatList
        data={todos}
        renderItem={renderTodoItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  todoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  editTodoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editTextInput: {
    flex: 1,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 5,
  },
  saveButton: {
    backgroundColor: 'blue',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
  },
  todoText: {
    fontSize: 16,
  },
  completedTodoText: {
    textDecorationLine: 'line-through',
    color: 'gray',
  },
  completeButton: {
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    paddingVertical: 5,
    borderRadius: 5,
  },
  completeButtonText: {
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    paddingVertical: 5,
    marginRight: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default TodoApp;
