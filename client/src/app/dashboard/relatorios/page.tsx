'use client';

import { useEffect, useState } from 'react';
import { Button, Card, Spin, Alert } from 'antd';
import { useTitle } from '@/contexts/TitleContext';
import { GoogleGenAI } from '@google/genai';

// Mock data - In a real application, this would be fetched from your API
const fetchDashboardData = async () => {
  return {
    totalProducts: 150,
    totalStockValue: 125500.75,
    lowStockItems: 12,
    monthlyEntries: 58,
    monthlyExits: 45,
    topStockedProducts: [
      { name: 'Notebook Gamer XYZ', quantity: 75 },
      { name: 'Mouse Sem Fio Ergonômico', quantity: 120 },
      { name: 'Teclado Mecânico RGB', quantity: 90 },
      { name: 'Monitor Ultrawide 34"', quantity: 45 },
      { name: 'SSD NVMe 1TB', quantity: 200 },
    ],
  };
};

export default function RelatoriosPage() {
  const { setTitle } = useTitle();
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<{
    totalProducts: number;
    totalStockValue: number;
    lowStockItems: number;
    monthlyEntries: number;
    monthlyExits: number;
    topStockedProducts: { name: string; quantity: number }[];
  } | null>(null);

  useEffect(() => {
    setTitle('Relatórios Gerados por IA');
    const loadData = async () => {
        const data = await fetchDashboardData();
        setDashboardData(data);
    }
    loadData();
  }, [setTitle]);

  const generateReport = async () => {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        setError('A chave da API do Gemini não foi configurada. Por favor, adicione NEXT_PUBLIC_GEMINI_API_KEY ao seu arquivo .env.local');
        return;
    }

    if (!dashboardData) {
        setError('Os dados do dashboard não foram carregados.');
        return;
    }

    setLoading(true);
    setError(null);
    setReport('');
    
    try {
      const genAI = new GoogleGenAI({
        apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        // projectId: process.env.NEXT_PUBLIC_GEMINI_PROJECT_ID,
        // location: process.env.NEXT_PUBLIC_GEMINI_LOCATION || 'us-central1',
      });

      const prompt = `
        Gere um relatório gerencial de análise de estoque com base nos dados fornecidos abaixo:

        - Total de Produtos: ${dashboardData.totalProducts}
        - Valor Total do Estoque: R$ ${dashboardData.totalStockValue.toLocaleString('pt-BR')}
        - Itens com Estoque Baixo: ${dashboardData.lowStockItems}
        - Entradas no Mês: ${dashboardData.monthlyEntries}
        - Saídas no Mês: ${dashboardData.monthlyExits}
        - Top 5 Produtos com Mais Estoque: ${dashboardData.topStockedProducts.map((p: {name: string, quantity: number}) => `${p.name} (${p.quantity})`).join(', ')}

        Escreva o texto em português do Brasil, com tom profissional e informativo. O relatório deve ser composto por seis seções numeradas com títulos simples, sem uso de símbolos especiais como hashtags (#) ou asteriscos (*). As seções devem ser:

        1. Resumo Executivo  
        2. Análise de Inventário  
        3. Movimentação de Estoque  
        4. Produtos em Destaque  
        5. Pontos de Atenção  
        6. Recomendações

        Evite usar formatação Markdown. Apresente o conteúdo de forma limpa e direta, como se estivesse em um documento de texto ou em uma página HTML simples. Seja claro, objetivo e mantenha uma estrutura fluida e bem organizada.
      `;

      
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 0, // Disables thinking
          },
        }
      });

      const text = response.text || '';
      console.log('Generated response:', response);
      console.log('Generated text:', text);
      setReport(text);
    } catch (e) {
      console.error(e);
      setError('Falha ao gerar o relatório. Verifique o console para mais detalhes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <div className="mb-4">
        <p className="mb-2">
          Esta página utiliza a API do Google Gemini para gerar uma análise textual e sugestões com base nos dados atuais do seu dashboard.
        </p>
        <Button type="primary" onClick={generateReport} loading={loading} disabled={!dashboardData}>
          Gerar Relatório de Análise de Estoque
        </Button>
      </div>

      {error && <Alert message="Erro" description={error} type="error" showIcon className="mb-4" />}

      {loading && (
        <div className="text-center">
          <Spin size="large" />
          <p>Gerando relatório... Isso pode levar alguns segundos.</p>
        </div>
      )}

      {report && (
        <Card title="Relatório Gerencial de Estoque">
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 'inherit' }}>{report}</pre>
        </Card>
      )}
    </Card>
  );
}
