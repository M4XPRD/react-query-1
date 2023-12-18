import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { addTodo, fetchTodos } from './api';
import TodoCard from './components/TodoCard';

const Demo = () => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');

  const { data: todos, isLoading } = useQuery({
    queryFn: () => fetchTodos(),
    queryKey: ['todos'],
    staleTime: Infinity,
  });

  const { mutateAsync: addTodoMutation } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <button
          type="button"
          onClick={async () => {
            try {
              await addTodoMutation({ title });
              setTitle('');
            } catch (err) {
              console.log(err);
            }
          }}
        >
          Add Todo
        </button>
      </div>
      {todos?.map((todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
};

export default Demo;
