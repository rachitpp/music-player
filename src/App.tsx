// Main App Component
import { MusicProvider } from "./context/MusicContext";
import Layout from "./components/Layout/Layout";
import ContentArea from "./components/Layout/ContentArea";
import "./styles/main.scss";

function App() {
  return (
    <MusicProvider>
      <Layout>
        <ContentArea />
      </Layout>
    </MusicProvider>
  );
}

export default App;
