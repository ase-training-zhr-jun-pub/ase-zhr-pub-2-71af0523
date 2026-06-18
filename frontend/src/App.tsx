import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AppProvider } from "@/lib/app-context"
import { AppShell } from "@/components/layout/app-shell"
import { Toaster } from "@/components/ui/sonner"
import { DashboardPage } from "@/pages/dashboard"
import { RaeumeSuchenPage } from "@/pages/raeume-suchen"
import { MeineBuchungenPage } from "@/pages/meine-buchungen"
import { BuchungsdetailPage } from "@/pages/buchungsdetail"
import { KollegenHeutePage } from "@/pages/kollegen-heute"
import { FavoritenPage } from "@/pages/favoriten"

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/raeume" element={<RaeumeSuchenPage />} />
            <Route path="/buchungen" element={<MeineBuchungenPage />} />
            <Route path="/buchungen/:id" element={<BuchungsdetailPage />} />
            <Route path="/kollegen" element={<KollegenHeutePage />} />
            <Route path="/favoriten" element={<FavoritenPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </AppProvider>
  )
}

export default App
