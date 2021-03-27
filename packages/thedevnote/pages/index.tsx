import Link from "next/link";
import Meta from "../components/head";

const NOTION_BLOG_ID =
  process.env.NOTION_BLOG_ID || "7d52200c3d6e4e89a1fa20d855ff88f0";

export type Post = {
  id: string;
  slug: string;
  title: string;
  date: string;
  is_draft: boolean;
  cover: {
    name: string;
    rawUrl: string;
    url: string;
  }[];
  type: string;
};

export const getAllPosts = async (): Promise<Post[]> => {
  return await fetch(
    `https://notion.thedenseabyss.xyz/v1/table/${NOTION_BLOG_ID}`
  ).then((res) => res.json());
};

export async function getStaticProps() {
  const posts = await getAllPosts();
  return {
    props: {
      posts,
    },
  };
}

{
  /* <img src={post?.cover[0].url} alt={post.title} /> */
}

function HomePage({ posts }: { posts: Post[] }) {
  return (
    <>
      <Meta />
      <div className="content p-4 font-serif">
        <div>
          {posts.map((post) => {
            if (!post?.is_draft) {
              return (
                <Link
                  href="/note/[slug]"
                  as={`/note/${post.slug}`}
                  key={post.slug}
                >
                  <a className="w-full lg:flex my-4">
                    {post?.cover && (
                      <section
                        className="h-48 grayscale lg:h-auto lg:w-48 flex-none bg-cover text-center overflow-hidden"
                        style={{
                          backgroundImage: `url(${post?.cover[0].url})`,
                        }}
                      ></section>
                    )}
                    <section className="p-4 flex flex-col justify-between leading-normal">
                      <b className="text-white font-serif text-2xl">
                        {post.title}
                      </b>
                      <div className="text-gray-400">jotted on {post.date}</div>
                    </section>
                  </a>
                </Link>
              );
            }
          })}
        </div>
      </div>
    </>
  );
}

export default HomePage;
