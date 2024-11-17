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
import { FilePenLine, Bookmark, Clock, Eye, Calendar } from "lucide-react"

export default function Page() {
  const handleViewAllNotes = () => {
    window.location.href = '/notes';
  };

  const handleViewAllCollection = () => {
    window.location.href = '/collection';
  };

  const recentCollections = [
    {
      title: "Data Structures",
      description: "Comprehensive guide to fundamental data structures",
      updatedAt: "3 days ago",
      itemCount: 12
    },
    {
      title: "System Design",
      description: "Collection of system design patterns and principles",
      updatedAt: "5 days ago",
      itemCount: 8
    }
  ];

  const recentProjects = [
    { 
      title: "Stack Data Structure",
      desc: "Complete guide to implementing and using stacks",
      views: 124,
      updated: "1 hour ago"
    },
    { 
      title: "LinkedIn Content Strategy",
      desc: "Social media content planning and execution",
      views: 89,
      updated: "1 day ago"
    },
    { 
      title: "Machine Learning Basics",
      desc: "Introduction to ML concepts and applications",
      views: 256,
      updated: "15 days ago"
    }
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 border-b px-4">
            <SidebarTrigger className="shrink-0" />
            <Separator orientation="vertical" className="h-6" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className="text-muted-foreground hover:text-primary">
                    Planoeducation
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-4">
              <Button
                className="flex items-center gap-2"
                variant="default"
              >
                <FilePenLine className="h-4 w-4" />
                New Note
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 space-y-8 p-8">
          {/* Collections Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Recent Collections</h2>
                <p className="text-sm text-muted-foreground">Your latest educational content collections</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleViewAllCollection} className="flex items-center gap-2">
                View All
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {recentCollections.map((collection, index) => (
                <Card key={index} className="hover:bg-muted/50 transition-colors">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">{collection.title}</CardTitle>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {collection.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {collection.updatedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <FilePenLine className="h-4 w-4" />
                        {collection.itemCount} items
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">Recent Projects</h2>
                <p className="text-sm text-muted-foreground">Your latest work and notes</p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleViewAllNotes} className="flex items-center gap-2">
                View All
                <FilePenLine className="h-4 w-4" />
              </Button>
            </div>

            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Views</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentProjects.map((project, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{project.title}</TableCell>
                      <TableCell className="text-muted-foreground">{project.desc}</TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {project.views}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {project.updated}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}