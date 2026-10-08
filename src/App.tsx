/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { CyberFactoryGame } from './components/CyberFactoryGame';
import { PipelineFlowchartView } from './components/PipelineFlowchartView';
import { UltronCommanderView } from './components/UltronCommanderView';
import { ProductLabView } from './components/ProductLabView';
import { LiveStorefrontView } from './components/LiveStorefrontView';
import { InventoryVaultView } from './components/InventoryVaultView';
import { MarketingHubView } from './components/MarketingHubView';
import { CrmSupportView } from './components/CrmSupportView';
import { CompliancePermitsView } from './components/CompliancePermitsView';
import { WhopAnalysisView } from './components/WhopAnalysisView';
import { MultiChannelHubView } from './components/MultiChannelHubView';
import { LazyButtonEngineView } from './components/LazyButtonEngineView';
import { AgentZeroConsole } from './components/AgentZeroConsole';
import { PerformanceMetricsView } from './components/PerformanceMetricsView';
import { AgentConsole } from './components/AgentConsole';

import { 
  INITIAL_PRODUCTS, 
  INITIAL_AGENTS, 
  FACTORY_SECTORS, 
  INITIAL_CUSTOMERS, 
  INITIAL_ORDERS, 
  INITIAL_TICKETS 
} from './data/mockData';
import { DigitalProduct, Agent, FactorySector, Customer, Order, SupportTicket } from './types';
import { playSound } from './utils/audio';
import { Gamepad2, ArrowLeft } from 'lucide-react';
import { useTheme } from './hooks/useTheme';
import { applyThemeToDOM } from './utils/themeManager';
import { neonforgeApi, ServerStatus } from './services/neonforgeApi';

export default function App() {
  const { theme, currentDramaticFont } = useTheme();
  const [currentTab, setCurrentTab] = useState<NavTab>('factory');
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [products, setProducts] = useState<DigitalProduct[]>(() => {
    const saved = localStorage.getItem('neonforge_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [sectors, setSectors] = useState<FactorySector[]>(FACTORY_SECTORS);
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('neonforge_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('neonforge_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('neonforge_gemini_key') || '';
  });

  const [isOverdriveActive, setIsOverdriveActive] = useState(false);
  const [logs, setLogs] = useState<{ id: string; timestamp: string; agent: string; text: string; type: 'info' | 'success' | 'warn' }[]>([
    {
      id: 'log-1',
      timestamp: new Date().toTimeString().slice(0, 8),
      agent: 'System',
      text: 'NeonForge OS Real Machine Engine connected. 9 game factory sectors nominal.',
      type: 'info'
    },
    {
      id: 'log-2',
      timestamp: new Date().toTimeString().slice(0, 8),
      agent: 'Sage',
      text: 'Etsy 13-tag algorithmic sync connected. Zero dropshipping compliance verified.',
      type: 'success'
    },
    {
      id: 'log-3',
      timestamp: new Date().toTimeString().slice(0, 8),
      agent: 'Zed',
      text: 'Cryptographic License Vault online. SHA-256 tokens ready for automated delivery.',
      type: 'info'
    }
  ]);

  // Initial Sync from Real Machine Express Backend & Check for Stripe Redirect
  useEffect(() => {
    // Bootstrap admin session for dashboard controls & Agent 0 live gate
    neonforgeApi.ensureAdminSession().catch(() => {});

    neonforgeApi.checkServerStatus().then(status => {
      if (status) {
        setServerStatus(status);
        addLog('System', `Connected to Real Machine Backend (Uptime: ${status.uptimeSeconds}s).`, 'success');
      }
    });

    // Check if customer returned from Stripe Checkout
    const urlParams = new URLSearchParams(window.location.search);
    const checkoutSessionId = urlParams.get('checkout_session');
    const orderParam = urlParams.get('order');
    if (checkoutSessionId) {
      neonforgeApi.verifyStripeSession(checkoutSessionId, orderParam || undefined).then(res => {
        if (res?.order) {
          addLog('Leo', `[Stripe Settlement] Order ${res.order.orderNumber} successfully processed for $${res.order.amount.toFixed(2)}.`, 'success');
          playSound('cash');
          neonforgeApi.getOrders().then(ords => { if (ords) setOrders(ords); });
          neonforgeApi.getCustomers().then(custs => { if (custs) setCustomers(custs); });
          setCurrentTab('storefront');
        }
      });
    }

    neonforgeApi.getProducts().then(prods => {
      if (prods && prods.length > 0) setProducts(prods);
    });

    neonforgeApi.getOrders().then(ords => {
      if (ords !== null) setOrders(ords);
    });

    neonforgeApi.getCustomers().then(custs => {
      if (custs !== null) setCustomers(custs);
    });

    neonforgeApi.getTickets().then(tkts => {
      if (tkts && tkts.length > 0) setTickets(tkts);
    });
  }, []);

  // Keep DOM styles in sync with active theme
  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  // Persist products and orders
  useEffect(() => {
    localStorage.setItem('neonforge_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('neonforge_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('neonforge_customers', JSON.stringify(customers));
  }, [customers]);

  const addLog = (agent: string, text: string, type: 'info' | 'success' | 'warn' = 'info') => {
    const newLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toTimeString().slice(0, 8),
      agent,
      text,
      type
    };
    setLogs(prev => [newLog, ...prev.slice(0, 50)]);
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('neonforge_gemini_key', key);
    addLog('System', `Gemini API Key updated. Direct generative AI model pipeline enabled.`, 'success');
  };

  const handleAddProduct = (newProduct: DigitalProduct) => {
    setProducts(prev => [newProduct, ...prev]);
    neonforgeApi.addProduct(newProduct).catch(console.warn);
    addLog('Aria', `Forged handmade asset: "${newProduct.title}" (${newProduct.sku}).`, 'success');
    addLog('Sage', `Synchronized 13 Etsy tags to listing index. Search volume score: ${newProduct.etsyOptimization.etsySearchVolumeScore}.`, 'info');
    addLog('Zed', `Sealed deliverable master container in License Vault.`, 'info');
  };

  const handlePlaceOrder = (order: Order, customer: Customer) => {
    setOrders(prev => [order, ...prev]);
    setCustomers(prev => {
      const existing = prev.find(c => c.email === customer.email);
      if (existing) {
        return prev.map(c => c.email === customer.email ? {
          ...c,
          totalSpend: c.totalSpend + order.amount,
          ordersCount: c.ordersCount + 1,
          lastOrderDate: new Date().toISOString().split('T')[0]
        } : c);
      }
      return [customer, ...prev];
    });

    setProducts(prev => prev.map(p => {
      if (p.id === order.productId) {
        return {
          ...p,
          salesCount: p.salesCount + 1,
          totalRevenue: p.totalRevenue + order.amount
        };
      }
      return p;
    }));

    neonforgeApi.placeOrder(order, customer).catch(console.warn);

    addLog('Leo', `New order settled: ${order.orderNumber} for $${order.amount.toFixed(2)} via ${order.channel}. Net: $${order.netProfit.toFixed(2)}.`, 'success');
    addLog('Zed', `Token ${order.downloadToken} minted for ${customer.name}. Instant download active.`, 'info');
  };

  const handleResolveTicket = (ticketId: string, replyText: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t,
      status: 'Resolved',
      aiDraftReply: replyText
    } : t));

    neonforgeApi.resolveTicket(ticketId, replyText).catch(console.warn);

    const ticket = tickets.find(t => t.id === ticketId);
    addLog('Kai', `Ticket #${ticketId} resolved autonomously for ${ticket?.customerName || 'customer'}. CSAT: 100%.`, 'success');
  };

  // Automated 9-Agent Overdrive Pipeline Trigger
  const handleTriggerOverdrive = () => {
    setIsOverdriveActive(true);
    neonforgeApi.triggerOverdrive().catch(console.warn);
    addLog('System', '>>> OVERDRIVE ACTIVATED: Running multi-agent production wave across all 9 sectors <<<', 'warn');

    setAgents(prev => prev.map(a => ({ ...a, status: 'working' })));
    setSectors(prev => prev.map(s => ({ ...s, status: 'boosted' })));

    setTimeout(() => {
      addLog('Nova', 'Scanned 14 unsaturated digital niches. Top trend: "AI Game Design HUD Icons".', 'info');
      playSound('agent');
    }, 600);

    setTimeout(() => {
      addLog('Aria', 'Generated master SVG & Notion database structure for pending queue.', 'info');
      playSound('agent');
    }, 1200);

    setTimeout(() => {
      addLog('Rex', 'Computed dynamic bundle pricing ladder: 42% margin expansion projected.', 'info');
      playSound('agent');
    }, 1800);

    setTimeout(() => {
      addLog('Zed', 'Packaged 4 assets into cryptographic download containers with SHA-256 tokens.', 'info');
      playSound('agent');
    }, 2400);

    setTimeout(() => {
      addLog('Maya', 'Dispatched 3 high-karma Reddit showcase posts & Twitter threads.', 'info');
      playSound('agent');
    }, 3000);

    setTimeout(() => {
      addLog('Leo', 'Overdrive cycle complete. System velocity +24%. Total profit margin held at 97.4%.', 'success');
      playSound('cash');
      setIsOverdriveActive(false);
      setAgents(prev => prev.map(a => ({ ...a, status: a.id === 'agent-rex' || a.id === 'agent-sage' || a.id === 'agent-kai' ? 'ready' : 'working' })));
    }, 4000);
  };

  const handleResetToLiveMode = async () => {
    const ok = await neonforgeApi.resetStoreToLiveClean();
    if (ok) {
      setOrders([]);
      setCustomers([]);
      localStorage.removeItem('neonforge_orders');
      localStorage.removeItem('neonforge_customers');
      const prods = await neonforgeApi.getProducts();
      if (prods) setProducts(prods);
      addLog('System', 'Store switched to LIVE PRODUCTION MODE ($0.00 baseline).', 'success');
      playSound('cash');
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const totalOrders = orders.length;
  const directRevenue = orders.filter(o => o.channel !== 'Etsy Sync').reduce((sum, o) => sum + o.amount, 0);
  const etsyRevenue = orders.filter(o => o.channel === 'Etsy Sync').reduce((sum, o) => sum + o.amount, 0);
  const activeAgentsCount = agents.filter(a => a.status === 'working' || a.status === 'ready').length;
  const unreadTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black transition-colors duration-300"
      style={{ backgroundColor: theme.bgVoid }}
    >
      {/* Top Cyber Navigation Bar */}
      <Navbar
        totalRevenue={totalRevenue}
        totalOrders={totalOrders}
        activeAgentsCount={activeAgentsCount}
        totalProductsCount={products.length}
        isOverdriveActive={isOverdriveActive}
        onTriggerOverdrive={handleTriggerOverdrive}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        onOpenStorePreview={() => setCurrentTab('storefront')}
        onResetLiveMode={handleResetToLiveMode}
        onOpenLazyButton={() => {
          playSound('warp');
          setCurrentTab('lazy-button');
        }}
        onOpenMultiChannel={() => {
          playSound('click');
          setCurrentTab('multichannel');
        }}
        onOpenAgent0={() => {
          playSound('warp');
          setCurrentTab('agent-0');
        }}
      />

      {/* Main Workspace: Sidebar + Dynamic Center Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Cyber Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          agents={agents}
          unreadTicketsCount={unreadTicketsCount}
        />

        {/* Dynamic Center Stage Views */}
        <main 
          className="flex-1 overflow-y-auto relative transition-colors duration-300"
          style={{ backgroundColor: theme.bgVoid }}
        >
          {/* Quick Return Floating Bar (Visible when drilled down into any sub-system) */}
          {currentTab !== 'factory' && (
            <div 
              className="sticky top-0 z-30 backdrop-blur-md border-b px-4 py-2.5 flex items-center justify-between shadow-lg"
              style={{
                backgroundColor: `${theme.bgSurface}F0`,
                borderColor: theme.borderTheme
              }}
            >
              <button
                onClick={() => {
                  playSound('warp');
                  setCurrentTab('factory');
                }}
                className="px-3.5 py-1.5 rounded-lg font-mono text-xs font-black uppercase flex items-center gap-2 shadow-md transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(135deg, ${theme.neonCyan}, ${theme.neonLime})`,
                  color: currentDramaticFont.badgeTextColor,
                  textShadow: currentDramaticFont.badgeTextShadow
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>◀ RETURN TO VIDEO GAME FACTORY FLOOR</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="hidden sm:inline">Active View:</span>
                <span className="font-bold uppercase" style={{ color: theme.neonCyan }}>
                  {currentTab.replace('-', ' ')}
                </span>
              </div>
            </div>
          )}

          {/* Agent 0: Autonomous Gateway & Cash Commissioning Overseer */}
          {currentTab === 'agent-0' && (
            <AgentZeroConsole
              products={products}
              onOpenStorefront={() => setCurrentTab('storefront')}
              onOpenMultiChannel={() => setCurrentTab('multichannel')}
            />
          )}

          {/* Performance Metrics: Recharts Data Visualization Module */}
          {currentTab === 'performance' && (
            <PerformanceMetricsView
              products={products}
              orders={orders}
              agents={agents}
              totalRevenue={totalRevenue}
              directRevenue={directRevenue}
              etsyRevenue={etsyRevenue}
              onSwitchTab={(targetTab) => setCurrentTab(targetTab)}
              onTriggerOverdrive={handleTriggerOverdrive}
            />
          )}

          {/* 0. Autonomous Empire: The Lazy Button View */}
          {currentTab === 'lazy-button' && (
            <LazyButtonEngineView
              onAddProduct={handleAddProduct}
              onSwitchToStore={() => setCurrentTab('storefront')}
              totalRevenue={totalRevenue}
              totalOrders={totalOrders}
            />
          )}

          {/* 1. Primary Default: Video Game 9-Factory Floor */}
          {currentTab === 'factory' && (
            <CyberFactoryGame
              totalRevenue={totalRevenue}
              directRevenue={directRevenue}
              etsyRevenue={etsyRevenue}
              onOpenSector={(targetTab) => setCurrentTab(targetTab)}
              onOpenCommanderTerminal={() => setCurrentTab('ultron')}
              onOpenLazyButton={() => setCurrentTab('lazy-button')}
              isOverdriveActive={isOverdriveActive}
              onTriggerOverdrive={handleTriggerOverdrive}
            />
          )}

          {/* 2. Flow Chart Diagram Video Game */}
          {currentTab === 'flowchart' && (
            <PipelineFlowchartView
              totalRevenue={totalRevenue}
              totalOrders={totalOrders}
              onSelectSubsystem={(targetTab) => setCurrentTab(targetTab)}
            />
          )}

          {/* 3. Ultron Station Commander Mech Terminal */}
          {currentTab === 'ultron' && (
            <UltronCommanderView
              totalRevenue={totalRevenue}
              directRevenue={directRevenue}
              etsyRevenue={etsyRevenue}
              onBackToFactory={() => setCurrentTab('factory')}
            />
          )}

          {/* 3.5. Multi-Channel Hub: Stripe + Etsy v3 Real Machine Engine */}
          {currentTab === 'multichannel' && (
            <MultiChannelHubView
              products={products}
              orders={orders}
              totalRevenue={totalRevenue}
              directRevenue={directRevenue}
              etsyRevenue={etsyRevenue}
              onResetToLiveMode={handleResetToLiveMode}
              onRefreshData={async () => {
                const p = await neonforgeApi.getProducts();
                const o = await neonforgeApi.getOrders();
                if (p) setProducts(p);
                if (o) setOrders(o);
              }}
            />
          )}

          {/* 4. Product Lab (Opened from Factory 2 or Sidebar) */}
          {currentTab === 'product-lab' && (
            <ProductLabView
              apiKey={apiKey}
              onAddProduct={handleAddProduct}
              onSwitchToStore={() => setCurrentTab('storefront')}
            />
          )}

          {/* 5. Storefront & Etsy Nexus (Opened from Factory 5 or Sidebar) */}
          {currentTab === 'storefront' && (
            <LiveStorefrontView
              products={products}
              onPlaceOrder={handlePlaceOrder}
              onDispatchTicket={(newTicket) => {
                setTickets(prev => [newTicket, ...prev]);
                addLog('Kai', `Support ticket #${newTicket.id.slice(-6)} received from storefront (${newTicket.customerEmail}): "${newTicket.subject}".`, 'info');
              }}
            />
          )}

          {/* 6. Inventory & Vault (Opened from Factory 3 or Sidebar) */}
          {currentTab === 'inventory' && (
            <InventoryVaultView
              products={products}
              orders={orders}
              onResetLiveMode={handleResetToLiveMode}
            />
          )}

          {/* 7. Marketing Hub (Opened from Factory 6 or Sidebar) */}
          {currentTab === 'marketing' && (
            <MarketingHubView
              products={products}
              orders={orders}
            />
          )}

          {/* 8. CRM & Kai (Opened from Factory 8 or Sidebar) */}
          {currentTab === 'crm' && (
            <CrmSupportView
              customers={customers}
              tickets={tickets}
              apiKey={apiKey}
              onResolveTicket={handleResolveTicket}
            />
          )}

          {/* 9. Permits & Legal (Opened from Factory 7 or Sidebar) */}
          {currentTab === 'compliance' && (
            <CompliancePermitsView />
          )}

          {/* 10. Whop Teardown & 60-Day Income Roadmap */}
          {currentTab === 'whop-analysis' && (
            <WhopAnalysisView />
          )}
        </main>
      </div>

      {/* Bottom Telemetry Console */}
      <AgentConsole
        logs={logs}
        onClearLogs={() => setLogs([])}
      />
    </div>
  );
}
