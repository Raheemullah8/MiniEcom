import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const dummyUsers = [
  { id: 1, name: "Ali Raza", email: "ali@example.com" },
  { id: 2, name: "Fatima Khan", email: "fatima@example.com" },
  { id: 3, name: "Usman Malik", email: "usman@example.com" },
]

export default function UsersTablePage() {
  return (
    <div className="p-8 max-w-5xl  ">
      <h2 className="text-3xl font-bold mb-6">All Users</h2>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dummyUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
