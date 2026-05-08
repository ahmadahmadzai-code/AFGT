import { AdminShell } from "@/components/layout/admin-shell";
import { PostForm } from "@/features/admin/editors/post-form";

export default function NewPostPage() {
  return (
    <AdminShell title="New post" description="Write a new blog post.">
      <PostForm />
    </AdminShell>
  );
}
