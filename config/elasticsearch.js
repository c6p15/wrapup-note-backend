// config/elasticsearch.js

require('dotenv').config();
const { Client } = require('@elastic/elasticsearch');

// Initialize Elasticsearch client
const esClient = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

// Test Elasticsearch connection
const testConnection = async () => {
    try {
        const esPing = await esClient.ping();
        console.log('Elasticsearch connected:', esPing);
    } catch (error) {
        console.error('Elasticsearch connection error:', error);
        console.error('Error details:', error.message);
        if (error.meta && error.meta.body) console.error('Error body:', error.meta.body);
        throw new Error('Failed to connect to Elasticsearch');
    }
};

// Export the client and connection test
module.exports = { esClient, testConnection };