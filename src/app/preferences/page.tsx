"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchPreferences, updatePreferences, fetchCategories, fetchSources, fetchAuthors } from "@/lib/api";
import { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import PreferenceSelector from "@/components/PreferenceSelector";

interface Preferences {
  sources: string[];
  categories: string[];
  authors: string[];
}

export default function PreferencesPage() {
  const queryClient = useQueryClient();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");

  const { data: preferences, isLoading: loadingPreferences } = useQuery({
    queryKey: ['preferences'],
    queryFn: fetchPreferences,
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: sources } = useQuery({
    queryKey: ['sources'],
    queryFn: fetchSources,
  });

  const { data: authors } = useQuery({
    queryKey: ['authors'],
    queryFn: fetchAuthors,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
      setSuccessMessage("Preferences updated successfully!");
      setErrorMessage("");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: (error: Error) => {
      setErrorMessage(error?.message || "Failed to update preferences");
      setSuccessMessage("");
    },
  });

  const handlePreferenceChange = (type: keyof Preferences, value: string, checked: boolean) => {
    if (!preferences) return;
    const currentList = preferences[type] || [];
    let updatedList;
    if (!checked) {
      updatedList = [...currentList, value];
    } else {
      updatedList = currentList.filter((item: string) => item !== value);
    }
    updatePreferencesMutation.mutate({
      [type]: updatedList,
    });
  };


  const sortList = (arr: string[] | undefined) => (arr || []).slice().sort((a, b) => a.toLocaleUpperCase().localeCompare(b.toLocaleUpperCase()))
  const [sortedSources, sortedCategories, sortedAuthors] = [sources, categories, authors].map(sortList);

  if (loadingPreferences) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Icon icon="icon-park-outline:loading" className="w-8 h-8 mx-auto mb-4 animate-spin" />
          <p>Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mb-4"
        >
          <Icon icon="icon-park-outline:left" className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
        <h1 className="text-3xl font-bold mb-2">News Preferences</h1>
        <p className="text-neutral-600">
          By default, you will see <b>all</b> sources, categories, and authors. To hide any, simply untick them below. <b>Unticked items are blacklisted and will be hidden from your news feed.</b>
        </p>
      </div>
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {errorMessage}
        </div>
      )}
      <div className="grid gap-8 md:grid-cols-3">
        <PreferenceSelector
          title="Sources"
          items={sortedSources}
          selectedItems={preferences?.sources || []}
          onItemChange={(value, checked) => handlePreferenceChange('sources', value, checked)}
          icon="icon-park-outline:source"
          loading={updatePreferencesMutation.isPending}
        />
        <PreferenceSelector
          title="Categories"
          items={sortedCategories}
          selectedItems={preferences?.categories || []}
          onItemChange={(value, checked) => handlePreferenceChange('categories', value, checked)}
          icon="icon-park-outline:category"
          loading={updatePreferencesMutation.isPending}
        />
        <PreferenceSelector
          title="Authors"
          items={sortedAuthors}
          selectedItems={preferences?.authors || []}
          onItemChange={(value, checked) => handlePreferenceChange('authors', value, checked)}
          icon="icon-park-outline:user"
          loading={updatePreferencesMutation.isPending}
          showSearch={true}
          searchPlaceholder="Search authors..."
          searchValue={authorSearch}
          onSearchChange={setAuthorSearch}
        />
      </div>
      {updatePreferencesMutation.isPending && (
        <div className="mt-6 text-center">
          <Icon icon="icon-park-outline:loading" className="w-6 h-6 mx-auto mb-2 animate-spin" />
          <p className="text-neutral-600">Updating preferences...</p>
        </div>
      )}
    </div>
  );
} 