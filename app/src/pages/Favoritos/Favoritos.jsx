import { Heart } from "lucide-react";
import { PageShell } from "../../components/PageShell/PageShell";
import { Panel } from "../../components/Panel/Panel";
import { AnimalGrid } from "../../components/AnimalGrid/AnimalGrid";
import { Button } from "../../components/Button/Button";
import { SectionTitle } from "../../components/SectionTitle/SectionTitle";
import { useFavorites } from "../../hooks/useFavorites";
import { useDados } from "../../data";

export function Favoritos() {
  const { favoritos } = useFavorites();
  const dados = useDados();
  const animais = dados.animais.filter((animal) => favoritos.includes(animal.id));
  const indisponiveis = animais.filter((a) => a.status !== "disponivel").length;

  return (
    <PageShell>
      <main className="container">
        <Panel style={{ marginBottom: "var(--space-5)" }}>
          <SectionTitle
            as="h2"
            icon={Heart}
            title="Meus favoritos"
            subtitle={
              indisponiveis > 0
                ? `Atenção: ${indisponiveis === 1 ? "1 favorito mudou" : `${indisponiveis} favoritos mudaram`} de status — confira o selo em cada card.`
                : "Compare com calma os animais que chamaram sua atenção."
            }
          />
        </Panel>
        <AnimalGrid
          animais={animais}
          emptyTitle="Você ainda não tem favoritos"
          emptyDescription="Clique no coração de um animal para guardá-lo aqui."
          emptyAction={<Button to="/">Buscar animais</Button>}
        />
      </main>
    </PageShell>
  );
}
