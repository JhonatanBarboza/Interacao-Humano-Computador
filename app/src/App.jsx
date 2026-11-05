import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { PerfilAnimal } from "./pages/PerfilAnimal/PerfilAnimal";
import { Abrigos } from "./pages/Abrigos/Abrigos";
import { PerfilAbrigo } from "./pages/PerfilAbrigo/PerfilAbrigo";
import { Favoritos } from "./pages/Favoritos/Favoritos";
import { Login } from "./pages/Login/Login";
import { Painel } from "./pages/Painel/Painel";
import { PainelAnimais } from "./pages/PainelAnimais/PainelAnimais";
import { PainelCadastro } from "./pages/PainelCadastro/PainelCadastro";
import { PainelPagina } from "./pages/PainelPagina/PainelPagina";
import { PainelPosts } from "./pages/PainelPosts/PainelPosts";
import { PaginaNaoEncontrada } from "./pages/PaginaNaoEncontrada/PaginaNaoEncontrada";

function App() {
  return (
    <Routes>
      {/* adotante / visitante */}
      <Route path="/" element={<Home />} />
      <Route path="/animal/:id" element={<PerfilAnimal />} />
      <Route path="/abrigos" element={<Abrigos />} />
      <Route path="/abrigo/:id" element={<PerfilAbrigo />} />
      <Route path="/favoritos" element={<Favoritos />} />

      {/* instituição */}
      <Route path="/login" element={<Login />} />
      <Route path="/painel" element={<Painel />} />
      <Route path="/painel/animais" element={<PainelAnimais />} />
      <Route path="/painel/cadastro" element={<PainelCadastro />} />
      <Route path="/painel/animais/:id/editar" element={<PainelCadastro />} />
      <Route path="/painel/pagina" element={<PainelPagina />} />
      <Route path="/painel/posts" element={<PainelPosts />} />

      <Route path="*" element={<PaginaNaoEncontrada />} />
    </Routes>
  );
}

export default App;
