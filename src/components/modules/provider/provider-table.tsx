"use client";

import { useState } from "react";
import { Provider } from "@/types/provider.type";
import { ProviderDialog } from "./provider-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import PaginationControls from "@/components/ui/pagination-control";

interface ProviderTableProps {
  providers: Provider[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function ProviderTable({ providers, meta }: ProviderTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(search, 500);

  // Handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    params.set("page", "1"); // Reset to first page on search
    router.push(`?${params.toString()}`);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  // Handle filter by status
  const handleFilterStatus = (isOpen?: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (isOpen !== undefined) {
      params.set("isOpen", isOpen.toString());
    } else {
      params.delete("isOpen");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const currentFilter = searchParams.get("isOpen");

  const pagination = meta || {
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <Input
            placeholder="Search providers by name..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">Filter:</span>
          <Button
            variant={currentFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterStatus(undefined)}
          >
            All
          </Button>
          <Button
            variant={currentFilter === "true" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterStatus(true)}
          >
            Open
          </Button>
          <Button
            variant={currentFilter === "false" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterStatus(false)}
          >
            Closed
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              {/* <TableHead>Description</TableHead> */}
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg
                      className="w-12 h-12 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <p className="text-lg font-medium">No providers found</p>
                    <p className="text-sm">
                      Try adjusting your search or filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">
                    {provider.restaurantName}
                  </TableCell>
                  {/* <TableCell className="max-w-xs truncate">
                    {provider.description || (
                      <span className="text-gray-400 italic">
                        No description
                      </span>
                    )}
                  </TableCell> */}
                  <TableCell>
                    {provider.phone || (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {provider.address || (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={provider.isOpen ? "default" : "secondary"}
                      className={
                        provider.isOpen
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-gray-400 hover:bg-gray-500"
                      }
                    >
                      {provider.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <ProviderDialog mode="edit" provider={provider}>
                      <Button variant="ghost" size="sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                        Edit
                      </Button>
                    </ProviderDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
    <div className="mt-12">
        <PaginationControls meta={pagination} />
    </div>
    </div>
  );
}