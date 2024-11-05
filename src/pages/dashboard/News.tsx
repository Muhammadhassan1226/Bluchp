import { Link } from "react-router-dom"

export default function News() {
  return (
    <div className="flex flex-col">
      <section className="w-full bg-gray-100 dark:bg-gray-800 py-12 md:py-24 lg:py-32">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <img
              src="/placeholder.svg"
              width="600"
              height="400"
              alt="Main News Article"
              className="rounded-lg object-cover"
              style={{ aspectRatio: "600/400", objectFit: "cover" }}
            />
          </div>
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-gray-200 px-3 py-1 text-sm font-medium dark:bg-gray-700 dark:text-gray-200">
              Breaking News
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Groundbreaking Discovery in Medical Research
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              A team of researchers has made a significant breakthrough in understanding a rare genetic disorder, paving
              the way for improved treatments and better quality of life for those affected.
            </p>
            <div className="flex gap-4">
              <Link
                to="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                
              >
                Read More
              </Link>
              <Link
                to="#"
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-6 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                
              >
                Share
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="group">
            <Link to="#" >
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  width="400"
                  height="300"
                  alt="News Article 1"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-50">
                  New Advancements in Renewable Energy Technology
                </h3>
                <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                  Researchers have developed a more efficient and cost-effective solar panel that could revolutionize
                  the renewable energy industry.
                </p>
              </div>
            </Link>
          </div>
          <div className="group">
            <Link to="#" >
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  width="400"
                  height="300"
                  alt="News Article 2"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-50">
                  Groundbreaking Advancements in Artificial Intelligence
                </h3>
                <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                  A team of researchers has developed a new AI algorithm that can learn and adapt in ways never seen
                  before, with implications across various industries.
                </p>
              </div>
            </Link>
          </div>
          <div className="group">
            <Link to="#" >
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  width="400"
                  height="300"
                  alt="News Article 3"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-50">
                  Innovative Approach to Urban Planning and Design
                </h3>
                <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                  Architects and urban planners have unveiled a new vision for sustainable and livable cities that
                  prioritize green spaces, public transportation, and community engagement.
                </p>
              </div>
            </Link>
          </div>
          <div className="group">
            <Link to="#" >
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  width="400"
                  height="300"
                  alt="News Article 4"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-50">
                  Groundbreaking Discoveries in Astrophysics
                </h3>
                <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                  A team of international researchers has made a series of groundbreaking discoveries that could
                  revolutionize our understanding of the universe and the laws of physics.
                </p>
              </div>
            </Link>
          </div>
          <div className="group">
            <Link to="#" >
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  width="400"
                  height="300"
                  alt="News Article 5"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-50">
                  Advancements in Sustainable Agriculture
                </h3>
                <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                  Researchers have developed new farming techniques and technologies that could significantly improve
                  crop yields and reduce the environmental impact of agriculture.
                </p>
              </div>
            </Link>
          </div>
          <div className="group">
            <Link to="#" >
              <div className="aspect-[4/3] overflow-hidden rounded-lg">
                <img
                  src="/placeholder.svg"
                  width="400"
                  height="300"
                  alt="News Article 6"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ aspectRatio: "400/300", objectFit: "cover" }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-gray-900 dark:group-hover:text-gray-50">
                  Breakthrough in Cancer Research
                </h3>
                <p className="text-gray-500 dark:text-gray-400 line-clamp-2">
                  A team of researchers has made a significant breakthrough in understanding the underlying mechanisms
                  of a rare form of cancer, paving the way for more effective treatments.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}