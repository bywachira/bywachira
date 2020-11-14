import React from "react";
import snapshot from "../schema";

const Index: React.FC<{}> = (): React.ReactElement => {
  return (
    <div>
      <p className="text-4xl">{snapshot.name}</p>
      <p className="text-base text-gray-700">{snapshot.meta_title}</p>
      <br />
      <p className="text-3xl">Projects</p>
      <div className="flex flex-wrap">
        {snapshot.projects.map(
          (
            project: {
              name: string;
              description: string;
              stack: Array<string>;
              status: string;
              link: string;
              cover: string;
            },
            idx: number
          ) => {
            return (
              <div
                className="flex-none sm:flex-1 md:flex-auto lg:flex-initial xl:flex-1 max-w-sm rounded overflow-hidden shadow-lg rounded-lg m-1 shadow"
                key={idx}
              >
                <img
                  className="w-full"
                  src={project.cover}
                  alt={project.name}
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{project.name}</div>
                  <p className="text-gray-700 text-base">
                    {project.description}
                  </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                  {project.stack.map((stack, idx) => {
                    return (
                      <span
                        key={idx}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      >
                        {stack}
                      </span>
                    );
                  })}
                </div>
                <div className="px-6 pt-4 pb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium leading-4 ${
                      project.status === "WIP"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    } mr-2`}
                  >
                    {project.status}
                  </span>
                </div>
                <br/>
                <a className="text-blue-500 p-1" href={project.link} target="_blank">
                  View
                </a>
              </div>
            );
          }
        )}
      </div>
      <br />
      <p className="text-3xl">Work Experience</p>
      {snapshot.work.map(
        (
          work: {
            company: string;
            role: string;
            period: string;
            logo: string;
          },
          idx: number
        ) => {
          return (
            <div
              className="max-w-sm w-full lg:max-w-full lg:flex m-1"
              key={idx}
            >
              <div className="bg-black rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal w-full">
                <div className="mb-8">
                  <div className="text-white font-bold text-xl mb-2">
                    {work.company}
                  </div>
                  <p className="text-gray-500 text-base">{work.role}</p>
                  <p className="text-gray-700 .text-sm">{work.period}</p>
                </div>
              </div>
            </div>
          );
        }
      )}
      <br />
      <p className="text-3xl">Contact</p>
      <ul>
        {snapshot.contact.map(
          (
            contact: {
              label: string;
              link: string;
            },
            idx: number
          ) => {
            return (
              <li key={idx} className="m-2">
                <a href={contact.link} target="_blank">
                  {contact.label}
                </a>
              </li>
            );
          }
        )}
      </ul>
      <br />
      <p className="text-3xl">Meta</p>
      <ul>
        {snapshot.meta.map(
          (
            meta: {
              label: string;
              link: string;
            },
            idx: number
          ) => {
            return (
              <li key={idx} className="m-2">
                <a href={meta.link} target="_blank">
                  {meta.label}
                </a>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};

export default Index;
