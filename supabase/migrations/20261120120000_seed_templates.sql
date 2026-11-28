-- Templates d'affichage des annonces.
-- Chaque `code` correspond à un composant React du frontend
-- (Ecampus-Frontend/src/components/cards/registry.ts).
INSERT INTO templates (id, code, nom) VALUES
    (1,  'AFFICHE_UNE',        'Affiche « À la une »'),
    (2,  'APPEL_PROJET',       'Appel à projets (papier millimétré)'),
    (3,  'JOURNAL_UNE',        'Journal — article de une'),
    (4,  'BREVE',              'Journal — brève'),
    (5,  'ETIQUETTE',          'Étiquette à œillet'),
    (6,  'POST_IT',            'Papier jaune avec scotch'),
    (7,  'POLAROID',           'Photo type polaroïd'),
    (8,  'AFFICHE_CREME',      'Affiche crème'),
    (9,  'AFFICHE_ACCENT',     'Affiche couleur d''accent'),
    (10, 'AFFICHE_SOMBRE',     'Affiche sombre'),
    (11, 'FEUILLE_QUADRILLEE', 'Feuille à lignes'),
    (12, 'NOTE_JOURNAL',       'Journal — mot de la rédaction');

-- Les ids ont été fixés à la main : on réaligne la séquence d'identité
-- pour que les prochains templates ne rentrent pas en collision.
SELECT setval(pg_get_serial_sequence('templates', 'id'), (SELECT MAX(id) FROM templates));
