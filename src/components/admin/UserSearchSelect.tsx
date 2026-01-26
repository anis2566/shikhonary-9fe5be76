import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  UserPlus,
  X,
  Loader2,
  CheckCircle2,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { User, UserRole } from "@/types";
import { searchUsers, validateUserEmail } from "@/lib/mock-api";

interface UserSearchSelectProps {
  selectedUser: User | null;
  onUserSelect: (user: User | null) => void;
  newUserData: NewUserData | null;
  onNewUserDataChange: (data: NewUserData | null) => void;
  mode: "existing" | "new";
  onModeChange: (mode: "existing" | "new") => void;
}

export interface NewUserData {
  name: string;
  email: string;
  role: UserRole;
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "TENANT_ADMIN", label: "Tenant Admin" },
  { value: "TEACHER", label: "Teacher" },
  { value: "STUDENT", label: "Student" },
  { value: "PARENT", label: "Parent" },
];

const UserSearchSelect = ({
  selectedUser,
  onUserSelect,
  newUserData,
  onNewUserDataChange,
  mode,
  onModeChange,
}: UserSearchSelectProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    message: string;
  } | null>(null);

  // Search users with debounce
  useEffect(() => {
    if (mode !== "existing" || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, mode]);

  // Validate email for new user
  useEffect(() => {
    if (mode !== "new" || !newUserData?.email) {
      setEmailValidation(null);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUserData.email)) {
      setEmailValidation(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidatingEmail(true);
      try {
        const result = await validateUserEmail(newUserData.email);
        setEmailValidation(result);
      } catch (error) {
        console.error("Email validation failed:", error);
      } finally {
        setIsValidatingEmail(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [newUserData?.email, mode]);

  const handleUserSelect = (user: User) => {
    onUserSelect(user);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleClearSelection = () => {
    onUserSelect(null);
    setSearchQuery("");
  };

  const handleNewUserChange = (field: keyof NewUserData, value: string) => {
    const updated = {
      name: newUserData?.name || "",
      email: newUserData?.email || "",
      role: newUserData?.role || "TENANT_ADMIN" as UserRole,
      [field]: value,
    };
    onNewUserDataChange(updated);
    if (field === "email") {
      setEmailValidation(null);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "destructive";
      case "TENANT_ADMIN":
        return "default";
      case "TEACHER":
        return "secondary";
      case "STUDENT":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(v) => onModeChange(v as "existing" | "new")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="existing" className="gap-2">
            <Search className="h-4 w-4" />
            Find Existing User
          </TabsTrigger>
          <TabsTrigger value="new" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Create New User
          </TabsTrigger>
        </TabsList>

        <TabsContent value="existing" className="space-y-4 mt-4">
          {selectedUser ? (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedUser.image} />
                      <AvatarFallback>
                        {selectedUser.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{selectedUser.name}</span>
                        <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                          {selectedUser.role.replace("_", " ")}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {selectedUser.email}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleClearSelection}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              <Label>Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>

              {searchResults.length > 0 && (
                <Card className="mt-2">
                  <CardContent className="p-2 max-h-64 overflow-y-auto">
                    {searchResults.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleUserSelect(user)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left",
                          user.tenantId && "opacity-60"
                        )}
                        disabled={!!user.tenantId}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.image} />
                          <AvatarFallback>
                            {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{user.name}</span>
                            <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                              {user.role.replace("_", " ")}
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground truncate block">
                            {user.email}
                          </span>
                          {user.tenantId && (
                            <span className="text-xs text-destructive">
                              Already assigned to a tenant
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}

              {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No users found. Try a different search or create a new user.
                </p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-4 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-user-name">Full Name *</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-user-name"
                  placeholder="John Doe"
                  value={newUserData?.name || ""}
                  onChange={(e) => handleNewUserChange("name", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-user-email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="new-user-email"
                  type="email"
                  placeholder="john@example.com"
                  value={newUserData?.email || ""}
                  onChange={(e) => handleNewUserChange("email", e.target.value)}
                  className={cn(
                    "pl-10 pr-10",
                    emailValidation && !emailValidation.isValid && "border-destructive"
                  )}
                />
                {isValidatingEmail && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
                {emailValidation && !isValidatingEmail && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {emailValidation.isValid ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {emailValidation && (
                <p className={cn(
                  "text-xs",
                  emailValidation.isValid ? "text-green-600" : "text-destructive"
                )}>
                  {emailValidation.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-user-role">Role *</Label>
              <Select
                value={newUserData?.role || "TENANT_ADMIN"}
                onValueChange={(value) => handleNewUserChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This user will be the administrator for this tenant
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="bg-muted/50 rounded-lg p-4 text-sm">
        <p className="font-medium mb-2">
          {mode === "existing" ? "Finding Existing User" : "Creating New User"}
        </p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          {mode === "existing" ? (
            <>
              <li>Search for users by name or email</li>
              <li>Users already assigned to a tenant cannot be selected</li>
              <li>The selected user will become the tenant admin</li>
            </>
          ) : (
            <>
              <li>A new user account will be created</li>
              <li>An invitation email will be sent to the user</li>
              <li>The user can set their password upon first login</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default UserSearchSelect;
