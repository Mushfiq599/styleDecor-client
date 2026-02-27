import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../../components/Dashboard/Sidebar"
import DashboardNavbar from "../../components/Dashboard/DashboardNavbar"

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-base-200">

      {/* ── Sidebar ── */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        <DashboardNavbar setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

    </div>
  )
}

export default Dashboard