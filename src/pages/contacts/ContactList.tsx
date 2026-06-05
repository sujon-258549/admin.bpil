import { useState } from "react"
import { useGetContactsQuery, useUpdateContactStatusMutation, useDeleteContactMutation } from "@/redux/features/contacts/contacts-api"
import { PageMeta } from "@/components/shared"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Loader2, MoreVertical, Search, Trash2, Mail, Phone, Building, Briefcase, IndianRupee } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { CustomSelect } from "@/components/ui/custom-select"

export default function ContactList() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const { data, isLoading, isFetching } = useGetContactsQuery({
    page,
    limit: 10,
    searchTerm: searchTerm || undefined,
    status: statusFilter !== "ALL" ? statusFilter : undefined
  })

  const [updateStatus] = useUpdateContactStatusMutation()
  const [deleteContact] = useDeleteContactMutation()

  const contacts = data?.data || []
  const meta = data?.meta

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap()
      toast.success("Status updated")
    } catch {
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return
    try {
      await deleteContact(id).unwrap()
      toast.success("Contact deleted")
    } catch {
      toast.error("Failed to delete")
    }
  }

  return (
    <>
      <PageMeta title="Contact Inquiries | Admin Portal" description="Manage contact form submissions" />
      
      <div className="flex flex-col gap-6 w-full py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Contact Inquiries</h1>
            <p className="text-muted-foreground mt-1">Manage messages received from the website contact form.</p>
          </div>
        </div>

        <Card>
          {(contacts.length > 0 || searchTerm || statusFilter !== "ALL" || isLoading) && (
            <CardHeader className="p-4 sm:p-6 pb-0">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search name, email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-[200px]">
                <CustomSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="Filter Status"
                >
                  <option value="ALL">All Status</option>
                  <option value="UNREAD">Unread</option>
                  <option value="READ">Read</option>
                  <option value="RESPONDED">Responded</option>
                </CustomSelect>
              </div>
              </div>
            </CardHeader>
          )}
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : contacts.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-foreground">No inquiries found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="divide-y border-t">
                {contacts.map((contact: any) => (
                  <div key={contact.id} className="p-4 sm:p-6 hover:bg-muted/50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-lg">{contact.name}</h4>
                          <Badge variant={contact.status === 'UNREAD' ? 'default' : 'secondary'}>
                            {contact.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(contact.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" /> {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" /> {contact.phone}
                            </div>
                          )}
                          {contact.company && (
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" /> {contact.company}
                            </div>
                          )}
                          {contact.budget && (
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-4 w-4" /> {contact.budget}
                            </div>
                          )}
                        </div>

                        {contact.services?.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <div className="flex gap-2 flex-wrap">
                              {contact.services.map((s: string) => (
                                <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 bg-muted/30 p-3 rounded-md text-sm whitespace-pre-wrap">
                          {contact.message}
                        </div>
                      </div>

                      <div className="flex items-start">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange(contact.id, "UNREAD")}>Mark as Unread</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(contact.id, "READ")}>Mark as Read</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(contact.id, "RESPONDED")}>Mark as Responded</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(contact.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {meta && meta.total > 10 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button 
              variant="outline" 
              disabled={page === 1 || isFetching}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button 
              variant="outline"
              disabled={page * 10 >= meta.total || isFetching}
              onClick={() => setPage(p => p + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
