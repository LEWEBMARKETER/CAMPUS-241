import {
  requireAdmin as sharedRequireAdmin,
  requireEditor as sharedRequireEditor,
  requireValidator as sharedRequireValidator,
} from "@campus241/shared/session";

// Le back-office n'a pas de "dashboard" utilisateur : un compte connecté mais
// sans rôle staff est renvoyé vers l'écran de connexion plutôt que de boucler
// sur une page qu'il n'a de toute façon pas le droit de voir.
const DENIED_PATH = "/connexion";

export function requireAdmin() {
  return sharedRequireAdmin({ deniedPath: DENIED_PATH });
}

export function requireEditor() {
  return sharedRequireEditor({ deniedPath: DENIED_PATH });
}

export function requireValidator() {
  return sharedRequireValidator({ deniedPath: DENIED_PATH });
}
