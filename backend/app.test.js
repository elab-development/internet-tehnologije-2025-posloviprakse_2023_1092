/* global describe, it, expect */
import request from 'supertest';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.get('/health', (req, res) => res.json({ status: 'ok' }));

describe('GET /health', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
