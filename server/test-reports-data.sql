-- Sample test data for Reports visualization
-- This creates users from different countries over the last 6 months to show growth trends

-- Note: Run this SQL in your PostgreSQL database to see the user growth charts
-- This will show how user registrations grow or reduce per country each month

-- ============================================
-- MONTH 1 (6 months ago) - Initial users
-- ============================================

-- Morocco: 3 users
INSERT INTO users (full_name, email, phone_number, phone_country_code, country, role, password, created_at, updated_at)
VALUES 
  ('Ahmed Benali', 'ahmed1@example.com', '612345678', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '6 months', NOW()),
  ('Fatima Zahra', 'fatima1@example.com', '612345679', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '6 months', NOW()),
  ('Youssef Amrani', 'youssef1@example.com', '612345680', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '6 months', NOW());

-- France: 5 users
INSERT INTO users (full_name, email, phone_number, phone_country_code, country, role, password, created_at, updated_at)
VALUES 
  ('Marie Dubois', 'marie1@example.com', '612345681', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '6 months', NOW()),
  ('Pierre Martin', 'pierre1@example.com', '612345682', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '6 months', NOW()),
  ('Sophie Laurent', 'sophie1@example.com', '612345683', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '6 months', NOW()),
  ('Luc Bernard', 'luc1@example.com', '612345684', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '6 months', NOW()),
  ('Claire Petit', 'claire1@example.com', '612345685', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '6 months', NOW());

-- Belgium: 2 users
INSERT INTO users (full_name, email, phone_number, phone_country_code, country, role, password, created_at, updated_at)
VALUES 
  ('Jan Janssens', 'jan1@example.com', '612345686', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '6 months', NOW()),
  ('Emma Peeters', 'emma1@example.com', '612345687', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '6 months', NOW());

-- ============================================
-- MONTH 2 (5 months ago) - Growth
-- ============================================

-- Morocco: 5 users (growth +2)
INSERT INTO users (full_name, email, phone_number, phone_country_code, country, role, password, created_at, updated_at)
VALUES 
  ('Karim El Fassi', 'karim2@example.com', '612345688', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Nadia Alami', 'nadia2@example.com', '612345689', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Hassan Tazi', 'hassan2@example.com', '612345690', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Salma Benjelloun', 'salma2@example.com', '612345691', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Omar Idrissi', 'omar2@example.com', '612345692', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW());

-- France: 8 users (growth +3)
INSERT INTO users (full_name, email, phone_number, phone_country_code, country, role, password, created_at, updated_at)
VALUES 
  ('Antoine Rousseau', 'antoine2@example.com', '612345693', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Camille Moreau', 'camille2@example.com', '612345694', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Thomas Simon', 'thomas2@example.com', '612345695', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Julie Blanc', 'julie2@example.com', '612345696', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Nicolas Garnier', 'nicolas2@example.com', '612345697', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Isabelle Faure', 'isabelle2@example.com', '612345698', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Alexandre Girard', 'alexandre2@example.com', '612345699', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Mathilde Bonnet', 'mathilde2@example.com', '612345700', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW());

-- Belgium: 4 users (growth +2)
INSERT INTO users (full_name, email, phone_number, phone_country_code, country, role, password, created_at, updated_at)
VALUES 
  ('Lucas Dubois', 'lucas2@example.com', '612345701', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Charlotte Claes', 'charlotte2@example.com', '612345702', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Noah Mertens', 'noah2@example.com', '612345703', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW()),
  ('Louise Maes', 'louise2@example.com', '612345704', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '5 months', NOW());

-- ============================================
-- MONTH 3 (4 months ago) - Continued growth
-- ============================================

-- Morocco: 10 users (growth +5)
INSERT INTO users (full_name, email, phone_number, phone_country_code, country, role, password, created_at, updated_at)
VALUES 
  ('Rachid Alaoui', 'rachid3@example.com', '612345705', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Leila Benkirane', 'leila3@example.com', '612345706', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Mehdi Cherkaoui', 'mehdi3@example.com', '612345707', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Amina Lahlou', 'amina3@example.com', '612345708', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Samir Berrada', 'samir3@example.com', '612345709', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Zineb Tazi', 'zineb3@example.com', '612345710', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Amine Kettani', 'amine3@example.com', '612345711', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Hind Bensouda', 'hind3@example.com', '612345712', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Tarik Chraibi', 'tarik3@example.com', '612345713', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Kenza Filali', 'kenza3@example.com', '612345714', '+212', 'Morocco', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW());

-- France: 12 users (growth +4)
INSERT INTO users (full_name, email, phone_number, phone_country_code, country, role, password, created_at, updated_at)
VALUES 
  ('Gabriel Leroy', 'gabriel3@example.com', '612345715', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Léa Roux', 'lea3@example.com', '612345716', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Hugo Fournier', 'hugo3@example.com', '612345717', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Chloé Mercier', 'chloe3@example.com', '612345718', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Louis Dupont', 'louis3@example.com', '612345719', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Emma Lefebvre', 'emma3@example.com', '612345720', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Arthur Lambert', 'arthur3@example.com', '612345721', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Manon Fontaine', 'manon3@example.com', '612345722', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Raphaël Chevalier', 'raphael3@example.com', '612345723', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Inès Giraud', 'ines3@example.com', '612345724', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Nathan Gauthier', 'nathan3@example.com', '612345725', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Zoé Perrin', 'zoe3@example.com', '612345726', '+33', 'France', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW());

-- Belgium: 6 users (growth +2)
INSERT INTO users (full_name, email, phone_number, phone_country_code, country, role, password, created_at, updated_at)
VALUES 
  ('Arthur Willems', 'arthur3b@example.com', '612345727', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Olivia Goossens', 'olivia3@example.com', '612345728', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Victor Wouters', 'victor3@example.com', '612345729', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Ella De Smet', 'ella3@example.com', '612345730', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Louis Jacobs', 'louis3b@example.com', '612345731', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW()),
  ('Mila Vermeulen', 'mila3@example.com', '612345732', '+32', 'Belgium', 'Individual', '$2b$10$hashedpassword', NOW() - INTERVAL '4 months', NOW());

-- Note: This shows user growth trends:
-- Morocco: 3 → 5 → 10 (strong growth)
-- France: 5 → 8 → 12 (steady growth)
-- Belgium: 2 → 4 → 6 (consistent growth)

-- You can continue this pattern for more months to see growth/reduction trends in the chart!
