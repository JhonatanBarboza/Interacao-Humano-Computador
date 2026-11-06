import { PageShell } from "../../components/PageShell/PageShell";
import { Panel } from "../../components/Panel/Panel";
import { Button } from "../../components/Button/Button";
import { EmptyState } from "../../components/EmptyState/EmptyState";

export function PaginaNaoEncontrada() {
  return (
    <PageShell>
      <main className="container">
        <Panel>
          <EmptyState
            title="Página não encontrada"
            description="O endereço acessado não existe ou o animal já não está mais disponível."
            action={<Button to="/">Voltar para o início</Button>}
          />
        </Panel>
      </main>
    </PageShell>
  );
}
