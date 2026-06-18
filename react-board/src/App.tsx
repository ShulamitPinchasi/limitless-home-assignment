import { useBoardSocket } from './hooks/useBoardSocket';
import BoardPage from './pages/BoardPage';
import { BoardProvider } from './state/BoardProvider';

const BoardApp = () => {
  useBoardSocket();
  return <BoardPage />;
};

const App = () => {
  return (
    <BoardProvider>
      <BoardApp />
    </BoardProvider>
  );
}

export default App;