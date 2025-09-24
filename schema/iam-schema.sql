-- IAM Package Database Schema
-- This schema supports the entity access control system

-- Table to store account information
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store roles
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to link accounts to entities with roles
CREATE TABLE IF NOT EXISTS account_entity_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL,
    entity_table VARCHAR(255) NOT NULL,
    entity_id UUID NOT NULL,
    role_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (role_name) REFERENCES roles(name) ON DELETE SET NULL,
    UNIQUE(account_id, entity_table, entity_id)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_account_entity_links_account_id ON account_entity_links(account_id);
CREATE INDEX IF NOT EXISTS idx_account_entity_links_entity ON account_entity_links(entity_table, entity_id);
CREATE INDEX IF NOT EXISTS idx_account_entity_links_role ON account_entity_links(role_name);

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
    ('owner', 'Full access to the entity'),
    ('admin', 'Administrative access to the entity'),
    ('member', 'Standard member access'),
    ('viewer', 'Read-only access')
ON CONFLICT (name) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for accounts table
DROP TRIGGER IF EXISTS update_accounts_updated_at ON accounts;
CREATE TRIGGER update_accounts_updated_at
    BEFORE UPDATE ON accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();