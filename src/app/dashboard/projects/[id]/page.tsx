export default function ProjectPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Project {params.id}</h1>
      {/* Project details */}
    </div>
  );
}