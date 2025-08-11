import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FolderIcon, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Event {
  id: string;
  name: string;
  driveLink: string;
}

interface AcademicYear {
  id: string;
  name: string;
  events: Event[];
}

export default function Index() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [newYearName, setNewYearName] = useState("");
  const [newEventName, setNewEventName] = useState("");
  const [newEventLink, setNewEventLink] = useState("");
  const [isAddingYear, setIsAddingYear] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("rcc-coverage-data");
    if (savedData) {
      setAcademicYears(JSON.parse(savedData));
    } else {
      // Initialize with sample data
      const sampleData: AcademicYear[] = [
        {
          id: "1",
          name: "2023-2024",
          events: [
            {
              id: "1",
              name: "Annual Sports Day",
              driveLink: "https://drive.google.com/sample1",
            },
            {
              id: "2",
              name: "Cultural Festival",
              driveLink: "https://drive.google.com/sample2",
            },
            {
              id: "3",
              name: "Graduation Ceremony",
              driveLink: "https://drive.google.com/sample3",
            },
          ],
        },
      ];
      setAcademicYears(sampleData);
      localStorage.setItem("rcc-coverage-data", JSON.stringify(sampleData));
    }
  }, []);

  // Save data to localStorage whenever academicYears changes
  useEffect(() => {
    localStorage.setItem("rcc-coverage-data", JSON.stringify(academicYears));
  }, [academicYears]);

  const handleAdminLogin = () => {
    if (password === "admin123") {
      // Simple password - in real app would be more secure
      setIsAdmin(true);
      setPassword("");
    } else {
      alert("Incorrect password!");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setSelectedYear(null);
  };

  const addAcademicYear = () => {
    if (newYearName.trim()) {
      const newYear: AcademicYear = {
        id: Date.now().toString(),
        name: newYearName.trim(),
        events: [],
      };
      setAcademicYears([...academicYears, newYear]);
      setNewYearName("");
      setIsAddingYear(false);
    }
  };

  const deleteAcademicYear = (yearId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this academic year and all its events?",
      )
    ) {
      setAcademicYears(academicYears.filter((year) => year.id !== yearId));
      if (selectedYear === yearId) {
        setSelectedYear(null);
      }
    }
  };

  const addEvent = () => {
    if (newEventName.trim() && newEventLink.trim() && selectedYear) {
      const newEvent: Event = {
        id: Date.now().toString(),
        name: newEventName.trim(),
        driveLink: newEventLink.trim(),
      };

      setAcademicYears(
        academicYears.map((year) =>
          year.id === selectedYear
            ? { ...year, events: [...year.events, newEvent] }
            : year,
        ),
      );

      setNewEventName("");
      setNewEventLink("");
      setIsAddingEvent(false);
    }
  };

  const deleteEvent = (yearId: string, eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setAcademicYears(
        academicYears.map((year) =>
          year.id === yearId
            ? {
                ...year,
                events: year.events.filter((event) => event.id !== eventId),
              }
            : year,
        ),
      );
    }
  };

  const selectedYearData = academicYears.find(
    (year) => year.id === selectedYear,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <FolderIcon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  RCC Coverage Team
                </h1>
                <p className="text-sm text-gray-600">
                  Event Documentation & Media Management
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isAdmin && (
                <Button variant="outline" onClick={handleAdminLogout}>
                  Logout Admin
                </Button>
              )}

              {!isAdmin ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Admin Access</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Admin Login</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) =>
                              e.key === "Enter" && handleAdminLogin()
                            }
                            placeholder="Enter admin password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Button onClick={handleAdminLogin} className="w-full">
                        Login
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : selectedYear ? (
                <Button onClick={() => setSelectedYear(null)} variant="outline">
                  Back to Years
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedYear ? (
          /* Academic Years View */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                Academic Years
              </h2>
              {isAdmin && (
                <Button onClick={() => setIsAddingYear(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Year
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {academicYears.map((year) => (
                <Card
                  key={year.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
                  onClick={() => setSelectedYear(year.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <FolderIcon className="w-8 h-8 text-primary group-hover:text-white" />
                      </div>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAcademicYear(year.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {year.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">Academic Year</p>
                    <p className="text-sm text-primary font-medium">
                      {year.events.length} events
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add Year Dialog */}
            <Dialog open={isAddingYear} onOpenChange={setIsAddingYear}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Academic Year</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearName">Academic Year Name</Label>
                    <Input
                      id="yearName"
                      value={newYearName}
                      onChange={(e) => setNewYearName(e.target.value)}
                      placeholder="e.g., 2024-2025"
                      onKeyPress={(e) => e.key === "Enter" && addAcademicYear()}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingYear(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addAcademicYear}>Add Year</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          /* Events View */
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {selectedYearData?.name}
                </h2>
                <p className="text-gray-600">Events and Documentation</p>
              </div>
              {isAdmin && (
                <Button onClick={() => setIsAddingEvent(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedYearData?.events.map((event) => (
                <Card
                  key={event.id}
                  className="hover:shadow-lg transition-shadow duration-200 group"
                >
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <FolderIcon className="w-6 h-6 text-primary" />
                      </div>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEvent(selectedYear!, event.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {event.name}
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(event.driveLink, "_blank")}
                      className="w-full"
                    >
                      View Documentation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedYearData?.events.length === 0 && (
              <div className="text-center py-12">
                <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No events yet
                </h3>
                <p className="text-gray-600">
                  {isAdmin
                    ? "Add your first event to get started."
                    : "Events will appear here once added by admin."}
                </p>
              </div>
            )}

            {/* Add Event Dialog */}
            <Dialog open={isAddingEvent} onOpenChange={setIsAddingEvent}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Event</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventName">Event Name</Label>
                    <Input
                      id="eventName"
                      value={newEventName}
                      onChange={(e) => setNewEventName(e.target.value)}
                      placeholder="e.g., Annual Sports Day"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driveLink">Google Drive Link</Label>
                    <Input
                      id="driveLink"
                      value={newEventLink}
                      onChange={(e) => setNewEventLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingEvent(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={addEvent}>Add Event</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
