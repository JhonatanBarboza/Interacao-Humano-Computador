import { useCallback, useEffect, useState } from "react";

const FAVORITOS_KEY = "patas-que-acolhem:favoritos";

function readFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITOS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Favoritos persistidos em localStorage e sincronizados entre instâncias
 * do hook via evento customizado (necessário porque o evento nativo
 * "storage" só dispara em outras abas, não na mesma aba).
 */
export function useFavorites() {
  const [favoritos, setFavoritos] = useState(readFavorites);

  useEffect(() => {
    const sync = () => setFavoritos(readFavorites());
    window.addEventListener("favoritos:change", sync);
    return () => window.removeEventListener("favoritos:change", sync);
  }, []);

  const isFavorito = useCallback((animalId) => favoritos.includes(animalId), [favoritos]);

  const toggleFavorito = useCallback((animalId) => {
    const atuais = readFavorites();
    const idx = atuais.indexOf(animalId);
    if (idx >= 0) atuais.splice(idx, 1);
    else atuais.push(animalId);
    localStorage.setItem(FAVORITOS_KEY, JSON.stringify(atuais));
    window.dispatchEvent(new Event("favoritos:change"));
  }, []);

  return { favoritos, isFavorito, toggleFavorito };
}
