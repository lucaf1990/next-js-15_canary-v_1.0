import React from "react";
import Form from "next/form";
import ResetSearchForm from "./ResetSearchForm";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";

const SearchForm = ({ query }: { query?: string }) => {
  return (
    <Form action="/" scroll={false} className="search-form-container">
      <Input
        name="query"
        defaultValue={query}
        className="search-form-input"
        placeholder="Search recipes, chefs, category..."
      />
      <div className="flex gap-2">
        {query && <ResetSearchForm />}
        <Button type="submit" className="search-form-submit">
          <Search className="search-form-icon-small text-white" />
        </Button>
      </div>
    </Form>
  );
};

export default SearchForm;
