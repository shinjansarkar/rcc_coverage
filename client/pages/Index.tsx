import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FolderIcon, Plus, Trash2, Eye, EyeOff, ArrowLeft, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubEvent {
  id: string;
  name: string;
  driveLink: string;
}

interface Event {
  id: string;
  name: string;
  driveLink?: string; // Optional for main events that only contain sub-events
  subEvents: SubEvent[];
}

interface AcademicYear {
  id: string;
  name: string;
  events: Event[];
}

export default function Index() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [newYearName, setNewYearName] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [newEventLink, setNewEventLink] = useState('');
  const [newSubEventName, setNewSubEventName] = useState('');
  const [newSubEventLink, setNewSubEventLink] = useState('');
  const [eventType, setEventType] = useState<'single' | 'multiple'>('single');
  const [isAddingYear, setIsAddingYear] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isAddingSubEvent, setIsAddingSubEvent] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    // Initialize with sample data including nested structure (force reset for demo)
    const sampleData: AcademicYear[] = [
      {
        id: '1',
        name: '2023-2024',
        events: [
          {
            id: '1',
            name: 'Techtricx',
            subEvents: [
              { id: '1', name: 'Robo Rash', driveLink: 'https://drive.google.com/robo-rash' },
              { id: '2', name: 'Robo Soccer', driveLink: 'https://drive.google.com/robo-soccer' },
              { id: '3', name: 'Minds Eye', driveLink: 'https://drive.google.com/minds-eye' },
              { id: '4', name: 'E Football', driveLink: 'https://drive.google.com/e-football' },
              { id: '5', name: 'PUBG', driveLink: 'https://drive.google.com/pubg' }
            ]
          },
          {
            id: '2',
            name: 'Cultural Festival',
            driveLink: 'https://drive.google.com/cultural-fest',
            subEvents: []
          },
          {
            id: '3',
            name: 'Annual Sports Day',
            subEvents: [
              { id: '1', name: 'Cricket Tournament', driveLink: 'https://drive.google.com/cricket' },
              { id: '2', name: 'Football Championship', driveLink: 'https://drive.google.com/football' }
            ]
          }
        ]
      },
      {
        id: '2',
        name: '2024-2025',
        events: []
      }
    ];
    setAcademicYears(sampleData);
    localStorage.setItem('rcc-coverage-data', JSON.stringify(sampleData));

  }, []);

  // Save data to localStorage whenever academicYears changes
  useEffect(() => {
    localStorage.setItem('rcc-coverage-data', JSON.stringify(academicYears));
  }, [academicYears]);

  const handleAdminLogin = () => {
    if (password === 'admin123') {
      setIsAdmin(true);
      setPassword('');
    } else {
      alert('Incorrect password!');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setSelectedYear(null);
    setSelectedEvent(null);
  };

  const addAcademicYear = () => {
    if (newYearName.trim()) {
      const newYear: AcademicYear = {
        id: Date.now().toString(),
        name: newYearName.trim(),
        events: []
      };
      setAcademicYears([...academicYears, newYear]);
      setNewYearName('');
      setIsAddingYear(false);
    }
  };

  const deleteAcademicYear = (yearId: string) => {
    if (confirm('Are you sure you want to delete this academic year and all its events?')) {
      setAcademicYears(academicYears.filter(year => year.id !== yearId));
      if (selectedYear === yearId) {
        setSelectedYear(null);
        setSelectedEvent(null);
      }
    }
  };

  const addEvent = () => {
    if (newEventName.trim() && selectedYear) {
      const newEvent: Event = {
        id: Date.now().toString(),
        name: newEventName.trim(),
        driveLink: newEventLink.trim() || undefined,
        subEvents: []
      };
      
      setAcademicYears(academicYears.map(year => 
        year.id === selectedYear 
          ? { ...year, events: [...year.events, newEvent] }
          : year
      ));
      
      setNewEventName('');
      setNewEventLink('');
      setIsAddingEvent(false);
    }
  };

  const deleteEvent = (yearId: string, eventId: string) => {
    if (confirm('Are you sure you want to delete this event and all its sub-events?')) {
      setAcademicYears(academicYears.map(year => 
        year.id === yearId 
          ? { ...year, events: year.events.filter(event => event.id !== eventId) }
          : year
      ));
      if (selectedEvent === eventId) {
        setSelectedEvent(null);
      }
    }
  };

  const addSubEvent = () => {
    if (newSubEventName.trim() && newSubEventLink.trim() && selectedYear && selectedEvent) {
      const newSubEvent: SubEvent = {
        id: Date.now().toString(),
        name: newSubEventName.trim(),
        driveLink: newSubEventLink.trim()
      };
      
      setAcademicYears(academicYears.map(year => 
        year.id === selectedYear 
          ? {
              ...year,
              events: year.events.map(event =>
                event.id === selectedEvent
                  ? { ...event, subEvents: [...event.subEvents, newSubEvent] }
                  : event
              )
            }
          : year
      ));
      
      setNewSubEventName('');
      setNewSubEventLink('');
      setIsAddingSubEvent(false);
    }
  };

  const deleteSubEvent = (yearId: string, eventId: string, subEventId: string) => {
    if (confirm('Are you sure you want to delete this sub-event?')) {
      setAcademicYears(academicYears.map(year => 
        year.id === yearId 
          ? {
              ...year,
              events: year.events.map(event =>
                event.id === eventId
                  ? { ...event, subEvents: event.subEvents.filter(subEvent => subEvent.id !== subEventId) }
                  : event
              )
            }
          : year
      ));
    }
  };

  const selectedYearData = academicYears.find(year => year.id === selectedYear);
  const selectedEventData = selectedYearData?.events.find(event => event.id === selectedEvent);

  const getEventDisplayInfo = (event: Event) => {
    const subEvents = event.subEvents || [];
    const hasSubEvents = subEvents.length > 0;
    const hasMainLink = !!event.driveLink;

    if (hasSubEvents && hasMainLink) {
      return `${subEvents.length + 1} items`; // sub-events + main event
    } else if (hasSubEvents) {
      return `${subEvents.length} sub-events`;
    } else {
      return 'Single event';
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">RCC Coverage Team</h1>
                <p className="text-sm text-gray-600">Event Documentation & Media Management</p>
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
                            onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
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
              ) : (
                <div className="flex items-center space-x-2">
                  {selectedEvent && (
                    <Button onClick={() => setSelectedEvent(null)} variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Events
                    </Button>
                  )}
                  {selectedYear && !selectedEvent && (
                    <Button onClick={() => setSelectedYear(null)} variant="outline" size="sm">
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Years
                    </Button>
                  )}
                </div>
              )}
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
              <h2 className="text-3xl font-bold text-gray-900">Academic Years</h2>
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
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{year.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">Academic Year</p>
                    <p className="text-sm text-primary font-medium">{year.events.length} events</p>
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
                      onKeyPress={(e) => e.key === 'Enter' && addAcademicYear()}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingYear(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addAcademicYear}>
                      Add Year
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : !selectedEvent ? (
          /* Events View */
          <div>
            <div className="flex items-center mb-4">
              <Button
                onClick={() => setSelectedYear(null)}
                variant="ghost"
                size="sm"
                className="mr-3 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Academic Years
              </Button>
            </div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{selectedYearData?.name}</h2>
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
                <Card key={event.id} className="hover:shadow-lg transition-shadow duration-200 group">
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{getEventDisplayInfo(event)}</p>
                    
                    <div className="space-y-2">
                      {event.subEvents.length > 0 || !event.driveLink ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedEvent(event.id)}
                          className="w-full"
                        >
                          View Details
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(event.driveLink!, '_blank')}
                          className="w-full"
                        >
                          View Documentation
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedYearData?.events.length === 0 && (
              <div className="text-center py-12">
                <FolderIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600">
                  {isAdmin ? "Add your first event to get started." : "Events will appear here once added by admin."}
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
                      placeholder="e.g., Techtricx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="driveLink">Google Drive Link (Optional)</Label>
                    <Input
                      id="driveLink"
                      value={newEventLink}
                      onChange={(e) => setNewEventLink(e.target.value)}
                      placeholder="https://drive.google.com/... (leave empty if event has sub-events)"
                    />
                    <p className="text-xs text-gray-500">
                      Leave empty if this event will contain multiple sub-events
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingEvent(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addEvent}>
                      Add Event
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          /* Sub-Events View */
          <div>
            <div className="flex items-center mb-4">
              <Button
                onClick={() => setSelectedEvent(null)}
                variant="ghost"
                size="sm"
                className="mr-3 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Events
              </Button>
            </div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{selectedEventData?.name}</h2>
                <p className="text-gray-600">Sub-events and Documentation</p>
              </div>
              {isAdmin && (
                <Button onClick={() => setIsAddingSubEvent(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sub-Event
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Main event link if it exists */}
              {selectedEventData?.driveLink && (
                <Card className="hover:shadow-lg transition-shadow duration-200 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Main Event Documentation</h3>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => window.open(selectedEventData.driveLink!, '_blank')}
                      className="w-full"
                    >
                      View Documentation
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Sub-events */}
              {selectedEventData?.subEvents.map((subEvent) => (
                <Card key={subEvent.id} className="hover:shadow-lg transition-shadow duration-200 group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      {isAdmin && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSubEvent(selectedYear!, selectedEvent!, subEvent.id)}
                          className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{subEvent.name}</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(subEvent.driveLink, '_blank')}
                      className="w-full"
                    >
                      View Documentation
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedEventData?.subEvents.length === 0 && !selectedEventData?.driveLink && (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sub-events yet</h3>
                <p className="text-gray-600">
                  {isAdmin ? "Add sub-events to organize documentation." : "Sub-events will appear here once added by admin."}
                </p>
              </div>
            )}

            {/* Add Sub-Event Dialog */}
            <Dialog open={isAddingSubEvent} onOpenChange={setIsAddingSubEvent}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Sub-Event to {selectedEventData?.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subEventName">Sub-Event Name</Label>
                    <Input
                      id="subEventName"
                      value={newSubEventName}
                      onChange={(e) => setNewSubEventName(e.target.value)}
                      placeholder="e.g., Robo Rash"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subEventLink">Google Drive Link</Label>
                    <Input
                      id="subEventLink"
                      value={newSubEventLink}
                      onChange={(e) => setNewSubEventLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddingSubEvent(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addSubEvent}>
                      Add Sub-Event
                    </Button>
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
