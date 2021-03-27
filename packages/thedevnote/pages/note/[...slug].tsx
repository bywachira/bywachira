import { NotionRenderer, BlockMapType } from "react-notion";

import { getAllPosts, Post } from "..";
import Meta from "../../components/head";

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  // Get all posts again
  const posts = await getAllPosts();

  // Find the current blogpost by slug
  const post = posts.find((t) => t.slug === slug);

  const blocks = await fetch(
    `https://notion-api.splitbee.io/v1/page/${post!.id}`
  ).then((res) => res.json());

  return {
    props: {
      blocks,
      post,
    },
  };
}

const BlogPost: React.FC<{ post: Post; blocks: BlockMapType }> = ({
  post,
  blocks,
}) => {
  if (!post) return null;

  return (
    <>
      <Meta
        title={post.title}
        image={post?.cover[0].url}
        description={`Post Tag: ${post.type}, Was jotted: ${post.date}`}
        link={`https://thedevnote.xyz/note/${post.slug}`}
      />
      <div className="content py-2">
        <h1 className="text-white px-4 font-serif text-6xl font-extrabold">
          {post.title}
        </h1>
        {post?.cover && (
          <section
            className="w-full h-96 pt-4 grayscale bg-center text-center overflow-hidden"
            style={{ backgroundImage: `url(${post?.cover[0].url})` }}
          ></section>
        )}
        <article className="p-4 text-white font-serif">
          <NotionRenderer blockMap={blocks} />
        </article>
      </div>
    </>
  );
};

export async function getStaticPaths() {
  const table = await getAllPosts();
  return {
    paths: table.map((row) => `/note/${row.slug}`),
    fallback: true,
  };
}

export default BlogPost;
