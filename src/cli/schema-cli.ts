#!/usr/bin/env node

import { readFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  schema?: string;
}

class IamSchemaCli {
  private client: Client;

  constructor(config: DatabaseConfig) {
    this.client = new Client({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.username,
      password: config.password,
    });
  }

  async connect(): Promise<void> {
    try {
      await this.client.connect();
      console.log('✓ Connected to database');
    } catch (error) {
      console.error('✗ Failed to connect to database:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    await this.client.end();
    console.log('✓ Disconnected from database');
  }

  async createSchema(schemaName?: string): Promise<void> {
    if (schemaName) {
      try {
        await this.client.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
        await this.client.query(`SET search_path TO "${schemaName}"`);
        console.log(`✓ Schema "${schemaName}" created/selected`);
      } catch (error) {
        console.error(`✗ Failed to create schema "${schemaName}":`, error);
        throw error;
      }
    }
  }

  async executeSqlFile(): Promise<void> {
    try {
      const schemaPath = join(__dirname, '../../schema/iam-schema.sql');
      const sqlContent = readFileSync(schemaPath, 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      for (const statement of statements) {
        await this.client.query(statement);
      }

      console.log('✓ IAM schema created successfully');
    } catch (error) {
      console.error('✗ Failed to execute schema:', error);
      throw error;
    }
  }

  async dropTables(): Promise<void> {
    try {
      const dropStatements = [
        'DROP TABLE IF EXISTS account_entity_links CASCADE',
        'DROP TABLE IF EXISTS accounts CASCADE',
        'DROP TABLE IF EXISTS roles CASCADE',
        'DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE'
      ];

      for (const statement of dropStatements) {
        await this.client.query(statement);
      }

      console.log('✓ IAM tables dropped successfully');
    } catch (error) {
      console.error('✗ Failed to drop tables:', error);
      throw error;
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || !['create', 'drop'].includes(command)) {
    console.log(`
Usage: npx nestjs-iam-cli <command> [options]

Commands:
  create    Create IAM schema tables
  drop      Drop IAM schema tables

Options:
  --host <host>         Database host (default: localhost)
  --port <port>         Database port (default: 5432)
  --database <db>       Database name (required)
  --username <user>     Database username (required)
  --password <pass>     Database password (required)
  --schema <schema>     Schema name (optional)

Examples:
  npx nestjs-iam-cli create --database mydb --username user --password pass
  npx nestjs-iam-cli create --database mydb --username user --password pass --schema iam
    `);
    process.exit(1);
  }

  // Parse arguments
  const config: DatabaseConfig = {
    host: getArg('--host') || 'localhost',
    port: parseInt(getArg('--port') || '5432'),
    database: getArg('--database') || '',
    username: getArg('--username') || '',
    password: getArg('--password') || '',
    schema: getArg('--schema'),
  };

  if (!config.database || !config.username || !config.password) {
    console.error('✗ Database, username, and password are required');
    process.exit(1);
  }

  const cli = new IamSchemaCli(config);

  try {
    await cli.connect();
    
    if (config.schema) {
      await cli.createSchema(config.schema);
    }

    if (command === 'create') {
      await cli.executeSqlFile();
    } else if (command === 'drop') {
      await cli.dropTables();
    }

  } catch (error) {
    console.error('✗ Command failed:', error);
    process.exit(1);
  } finally {
    await cli.disconnect();
  }
}

function getArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index !== -1 && index + 1 < process.argv.length ? process.argv[index + 1] : undefined;
}

// Check if this file is being run directly
if (process.argv[1] && process.argv[1].includes('schema-cli')) {
  main().catch(console.error);
}

export { IamSchemaCli };