import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fragment, useState, type FormEvent } from "react";
import { parseDiff, Diff, Hunk, type FileData } from "react-diff-view";

function renderFile(options: FileData) {
  const { oldRevision, newRevision, type, hunks, oldPath } = options;
  return (
    <section className="border border-md">
      <span>{oldPath}</span>
      <Diff key={oldRevision + '-' + newRevision} viewType="split" diffType={type} hunks={hunks}>
        {hunks => hunks.map((hunk) => (
          <Hunk key={'hunk-' + hunk.content} hunk={hunk} />
        ))}
      </Diff>
    </section>
  );
}

export function APITester() {
  const [files, setFiles] = useState<FileData[][] | undefined>(undefined);

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);
      const endpoint = formData.get("endpoint") as string;
      const url = new URL(endpoint, location.href);
      const method = formData.get("method") as string;
      const res = await fetch(url, { method });

      const data = await res.json();

      if (Array.isArray(data.message)) {
        const files = (data.message as string[]).map((diff) => parseDiff(diff, { nearbySequences: "zip" }));
        setFiles(files);
      }
    } catch (error) {
      // responseInputRef.current!.value = String(error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={testEndpoint} className="flex items-center gap-2">
        <Label htmlFor="method" className="sr-only">
          Method
        </Label>
        <Select name="method" defaultValue="GET">
          <SelectTrigger className="w-[100px]" id="method">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
          </SelectContent>
        </Select>
        <Label htmlFor="endpoint" className="sr-only">
          Endpoint
        </Label>
        <Input id="endpoint" type="text" name="endpoint" defaultValue="/api/hello" placeholder="/api/hello" />
        <Button type="submit" variant="secondary">
          Send
        </Button>
      </form>
      <div className="h-[300px]">
        {files?.map((file, index) => (
          <Fragment key={index}>
            {file.map(renderFile)}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
