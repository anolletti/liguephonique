import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import BookThumbnail from "./components/BookThumbnail";
import MainPage from "./pages/MainPage";
import BookPage from "./pages/Book";

function BookRoute() {
  const { sound } = useParams();

  return (
    <BookThumbnail title="éclaira" image="/images/sample.jpg" sound={sound} />
  );
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/phoneme/:sound" element={<BookPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
