import { Download, Plus, TrendingUp, Users, Activity, Clock, DollarSign, Search, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function TenantsPage() {
  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-[22px] font-bold text-gray-900 leading-tight">Tenant Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage all restaurant tenants on the ScanServe platform</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 shadow-sm font-medium">
            <Download size={16} />
            Export CSV
          </Button>
          <Button className="gap-2 bg-red-500 hover:bg-red-600 shadow-sm font-medium">
            <Plus size={16} />
            Add Tenant
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <div className="text-sm font-semibold text-gray-500 mb-1">Total Tenants</div>
            <div className="font-display font-extrabold text-[28px] text-gray-900 leading-none mb-2">48</div>
            <div className="flex items-center gap-1 text-xs font-bold text-green-600">
              <TrendingUp size={14} />
              <span>+4 this month</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div className="text-sm font-semibold text-gray-500 mb-1">Active</div>
            <div className="font-display font-extrabold text-[28px] text-green-600 leading-none mb-2">42</div>
            <div className="flex items-center gap-1 text-xs font-bold text-green-600">
              <TrendingUp size={14} />
              <span>87.5% retention</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
            <div className="text-sm font-semibold text-gray-500 mb-1">Trial</div>
            <div className="font-display font-extrabold text-[28px] text-purple-600 leading-none mb-2">6</div>
            <div className="flex items-center gap-1 text-xs font-bold text-green-600">
              <TrendingUp size={14} />
              <span>2 converting soon</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute top-6 right-6 w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <div className="text-sm font-semibold text-gray-500 mb-1">MRR</div>
            <div className="font-display font-extrabold text-[24px] text-gray-900 leading-none mb-2">₹2,84,000</div>
            <div className="flex items-center gap-1 text-xs font-bold text-green-600">
              <TrendingUp size={14} />
              <span>+₹18,500 vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card */}
      <Card className="shadow-sm border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div className="flex items-center gap-6">
            <button className="text-sm font-semibold text-red-500 border-b-2 border-red-500 pb-4 -mb-[17px] flex items-center gap-2">
              All
              <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">48</span>
            </button>
            <button className="text-sm font-semibold text-gray-500 hover:text-gray-900 pb-4 -mb-[17px] flex items-center gap-2 transition-colors">
              Active
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">42</span>
            </button>
            <button className="text-sm font-semibold text-gray-500 hover:text-gray-900 pb-4 -mb-[17px] flex items-center gap-2 transition-colors">
              Trial
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">6</span>
            </button>
            <button className="text-sm font-semibold text-gray-500 hover:text-gray-900 pb-4 -mb-[17px] flex items-center gap-2 transition-colors">
              Churned
              <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">0</span>
            </button>
          </div>
          <div className="relative">
            <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 font-medium cursor-pointer">
              <option>All Tiers</option>
              <option>Basic</option>
              <option>Standard</option>
              <option>Premium</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-gray-500 py-3">Restaurant Name</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-gray-500 py-3">Owner</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-gray-500 py-3">Outlets</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-gray-500 py-3">Tier</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-gray-500 py-3">Status</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-gray-500 py-3">MRR</TableHead>
                <TableHead className="font-bold text-[11px] uppercase tracking-wider text-gray-500 py-3 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Row 1 */}
              <TableRow className="hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 rounded-md border border-gray-200">
                      <AvatarFallback className="bg-red-500 text-white text-xs font-bold rounded-md">AK</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">Annapurna Kitchen</div>
                      <div className="text-[11px] text-gray-500 font-mono">annapurna-kitchen</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">Priya Sharma</TableCell>
                <TableCell className="font-medium">3</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700 hover:bg-orange-100 uppercase tracking-wide text-[10px] font-bold">Premium</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 text-[11px] font-semibold flex items-center w-fit gap-1.5 px-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">₹14,999</TableCell>
                <TableCell className="text-right pr-6">
                  <Button variant="outline" size="sm" className="h-8 shadow-none bg-white">View</Button>
                </TableCell>
              </TableRow>
              
              {/* Row 2 */}
              <TableRow className="hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 rounded-md border border-gray-200">
                      <AvatarFallback className="bg-orange-500 text-white text-xs font-bold rounded-md">SG</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">Spice Garden</div>
                      <div className="text-[11px] text-gray-500 font-mono">spice-garden</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">Rajesh Patel</TableCell>
                <TableCell className="font-medium">2</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 uppercase tracking-wide text-[10px] font-bold">Standard</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 text-[11px] font-semibold flex items-center w-fit gap-1.5 px-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">₹8,999</TableCell>
                <TableCell className="text-right pr-6">
                  <Button variant="outline" size="sm" className="h-8 shadow-none bg-white">View</Button>
                </TableCell>
              </TableRow>

              {/* Row 3 */}
              <TableRow className="hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 rounded-md border border-gray-200">
                      <AvatarFallback className="bg-teal-600 text-white text-xs font-bold rounded-md">DP</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">Das Prakash</div>
                      <div className="text-[11px] text-gray-500 font-mono">das-prakash</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">Ananya Das</TableCell>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 uppercase tracking-wide text-[10px] font-bold">Basic</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 text-[11px] font-semibold flex items-center w-fit gap-1.5 px-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Active
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">₹4,999</TableCell>
                <TableCell className="text-right pr-6">
                  <Button variant="outline" size="sm" className="h-8 shadow-none bg-white">View</Button>
                </TableCell>
              </TableRow>

              {/* Row 4 */}
              <TableRow className="hover:bg-gray-50 cursor-pointer border-b border-gray-100">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 rounded-md border border-gray-200">
                      <AvatarFallback className="bg-blue-600 text-white text-xs font-bold rounded-md">TE</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900">Thelewala Express</div>
                      <div className="text-[11px] text-gray-500 font-mono">thelewala-express</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">Pappu Yadav</TableCell>
                <TableCell className="font-medium">1</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 uppercase tracking-wide text-[10px] font-bold">Basic</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 text-[11px] font-semibold flex items-center w-fit gap-1.5 px-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    Trial
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">₹0</TableCell>
                <TableCell className="text-right pr-6">
                  <Button variant="outline" size="sm" className="h-8 shadow-none bg-white">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-bold text-gray-900">4</span> of <span className="font-bold text-gray-900">48</span> tenants
          </div>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="w-8 h-8 rounded shadow-none" disabled>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="sm" className="w-8 h-8 rounded shadow-none border-red-500 text-red-600 bg-red-50">1</Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 rounded hover:bg-gray-100">2</Button>
            <Button variant="ghost" size="sm" className="w-8 h-8 rounded hover:bg-gray-100">3</Button>
            <Button variant="ghost" size="icon" className="w-8 h-8 rounded hover:bg-gray-100">
              <MoreHorizontal size={16} />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8 rounded shadow-none">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
