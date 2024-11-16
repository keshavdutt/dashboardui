"use client"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FilePenLine, Bookmark, FileDown } from "lucide-react"

export default function Page() {

  const handleViewAllNotes = () => {
    window.location.href = '/notes';
  };

  const handleViewAllCollection = () => {
    window.location.href = '/collection';
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Planoeducation
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto mr-8">
            <Button
              variant="outline"
            >
              New Notes
            </Button>
          </div>
        </header>
        {/* Main Area */}

        <div className="flex flex-1 gap-4 p-4 pt-0">
          <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
            {/* Recent Repositories */}
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Recent Collection</h2>
                <Button variant="link" size="sm" className="text-blue-400" onClick={handleViewAllCollection}>
                  View All
                </Button>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Repository Card */}
                {[...Array(2)].map((_, index) => (
                  <Card key={index} className="bg-gray-800">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Data Structures</span>
                        <span className="text-sm text-gray-400">3 days ago</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">Some description of the collection...</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Recent projects</h2>
                <Button variant="link" size="sm" className="text-blue-400" onClick={handleViewAllNotes}>
                  View All
                </Button>
              </div>
              <div className="mt-4">
                <Table className="bg-gray-800 rounded-lg">
                  <TableHeader>
                    <TableRow className="bg-gray-700 text-white">
                      <TableHead className="px-4 py-2">Title</TableHead>
                      <TableHead className="px-4 py-2">Description</TableHead>
                      <TableHead className="px-4 py-2">Views</TableHead>
                      <TableHead className="px-4 py-2">Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { title: "Stack Data Structure", desc: "something about tack", views: 1, updated: "1 hour ago" },
                      { title: "linkedin post", desc: "Social media content", views: 1, updated: "1 day ago" },
                      { title: "Machine Learning", desc: "Frontend tooling", views: 3, updated: "15 days ago" },
                    ].map((project, index) => (
                      <TableRow
                        key={index}
                        className="odd:bg-gray-900 even:bg-gray-800 hover:bg-gray-700 transition"
                      >
                        <TableCell className="px-4 py-2">{project.title}</TableCell>
                        <TableCell className="px-4 py-2">{project.desc}</TableCell>
                        <TableCell className="px-4 py-2">{project.views}</TableCell>
                        <TableCell className="px-4 py-2">{project.updated}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
