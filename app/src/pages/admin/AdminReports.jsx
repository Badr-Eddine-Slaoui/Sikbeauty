"use client";
import React, { useState, useEffect } from 'react';
import { api } from '../../config/api';
import API_ENDPOINTS from '../../config/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, ShoppingCart, DollarSign, Users } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function AdminReports() {
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.ADMIN.REPORTS);
      setReportsData(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching reports data:', err);
      setError('Échec du chargement des données de rapport');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!reportsData) return;

    const doc = new jsPDF();
    const autoTablePlugin = autoTable;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Add custom fonts and colors matching brand
    doc.setTextColor(51, 51, 51);
    
    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Rapport d\'Analyse', pageWidth / 2, 20, { align: 'center' });
    
    // Brand line
    doc.setDrawColor(181, 72, 58); // brandRed
    doc.setLineWidth(1);
    doc.line(20, 25, pageWidth - 20, 25);
    
    // Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    const date = new Date().toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(`Généré le ${date}`, pageWidth / 2, 32, { align: 'center' });
    
    let yPos = 45;
    
    // Summary Statistics
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('Résumé Statistique', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    
    const summaryData = [
      ['Revenu Total (12 mois)', `€${reportsData.summary.totalRevenue.toFixed(2)}`],
      ['Total Commandes', reportsData.summary.totalOrders.toString()],
      ['Valeur Moyenne Commande', `€${reportsData.summary.averageOrderValue.toFixed(2)}`],
      ['Revenu Mois Actuel', `€${reportsData.summary.currentMonthRevenue.toFixed(2)}`],
      ['Croissance Revenu', `${reportsData.summary.revenueGrowth >= 0 ? '+' : ''}${reportsData.summary.revenueGrowth.toFixed(1)}%`],
      ['Croissance Commandes', `${reportsData.summary.ordersGrowth >= 0 ? '+' : ''}${reportsData.summary.ordersGrowth.toFixed(1)}%`]
    ];
    
    autoTable(doc, {
      startY: yPos,
      head: [['Métrique', 'Valeur']],
      body: summaryData,
      theme: 'striped',
      headStyles: { 
        fillColor: [181, 72, 58],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: 20, right: 20 }
    });
    
    yPos = doc.lastAutoTable.finalY + 15;
    
    // Best Selling Products
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('Meilleurs Produits', 20, yPos);
    yPos += 5;
    
    const productsData = reportsData.bestSellingProducts.slice(0, 10).map((product, index) => [
      (index + 1).toString(),
      product.productTitle,
      product.categoryName,
      product.totalQuantitySold.toString(),
      `€${product.totalRevenue.toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Produit', 'Catégorie', 'Quantité', 'Revenu']],
      body: productsData,
      theme: 'striped',
      headStyles: { 
        fillColor: [181, 72, 58],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 25 },
        4: { cellWidth: 30 }
      }
    });
    
    // Add new page for monthly data
    doc.addPage();
    yPos = 20;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51);
    doc.text('Données Mensuelles', 20, yPos);
    yPos += 5;
    
    const monthlyData = reportsData.monthlyPurchasesAndOrders.map(month => [
      `${month.month} ${month.year}`,
      month.orderCount.toString(),
      `€${month.totalPurchases.toFixed(2)}`
    ]);
    
    autoTable(doc, {
      startY: yPos,
      head: [['Mois', 'Commandes', 'Revenu']],
      body: monthlyData,
      theme: 'striped',
      headStyles: { 
        fillColor: [181, 72, 58],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      margin: { left: 20, right: 20 }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Page ${i} sur ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Save PDF
    doc.save(`rapport-sikbeauty-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brandRed mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Chargement des rapports...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          {error}
        </p>
      </div>
    );
  }

  if (!reportsData) return null;

  return (
    <div className="space-y-4">
      {/* Header with Download Button */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
              Rapports d'Analyse
            </h2>
            <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Vue d'ensemble des performances sur 12 mois
            </p>
          </div>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 px-4 py-2 bg-brandRed text-white rounded-lg hover:bg-hoverBrandRed transition-colors"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <Download size={18} />
            Télécharger PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Revenu Total
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                €{reportsData.summary.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                12 derniers mois
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Total Commandes
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {reportsData.summary.totalOrders}
              </p>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Toutes périodes
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Valeur Moyenne
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                €{reportsData.summary.averageOrderValue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Par commande
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Croissance
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {reportsData.summary.revenueGrowth >= 0 ? '+' : ''}{reportsData.summary.revenueGrowth.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Mois en cours
              </p>
            </div>
            <div className={`p-3 rounded-full ${
              reportsData.summary.revenueGrowth >= 0 ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <TrendingUp className={reportsData.summary.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'} size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Purchases and Orders Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Achats et Commandes Mensuels
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={reportsData.monthlyPurchasesAndOrders}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#6b7280"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                fontFamily: "'Montserrat', sans-serif",
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
            />
            <Legend 
              wrapperStyle={{ fontFamily: "'Montserrat', sans-serif" }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="totalPurchases" 
              stroke="#B5483A" 
              strokeWidth={2}
              name="Revenu (€)"
              dot={{ fill: '#B5483A', r: 4 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="orderCount" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Commandes"
              dot={{ fill: '#3b82f6', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Users by Country */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Nouveaux Utilisateurs par Pays
        </h3>
        <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          Croissance mensuelle des inscriptions par pays
        </p>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={reportsData.monthlyUsersByCountry}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '12px' }}
              label={{ value: 'Nombre d\'utilisateurs', angle: -90, position: 'insideLeft', style: { fontFamily: "'Montserrat', sans-serif" } }}
            />
            <Tooltip 
              contentStyle={{ 
                fontFamily: "'Montserrat', sans-serif",
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}
              formatter={(value, name) => [`${value} utilisateur${value > 1 ? 's' : ''}`, name]}
            />
            <Legend 
              wrapperStyle={{ fontFamily: "'Montserrat', sans-serif" }}
            />
            {reportsData.countries && reportsData.countries.map((country, index) => {
              const colors = ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6', '#f97316'];
              return (
                <Bar 
                  key={country} 
                  dataKey={country} 
                  fill={colors[index % colors.length]} 
                  name={country} 
                />
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Best Selling Products */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
            Meilleurs Produits
          </h3>
          <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Top 10 des produits les plus vendus
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Quantité Vendue
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Revenu Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reportsData.bestSellingProducts.map((product, index) => (
                <tr key={product.productId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {product.productTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-brandRed/10 text-brandRed" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {product.categoryName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      {product.totalQuantitySold} unités
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-green-600" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                      €{product.totalRevenue.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

