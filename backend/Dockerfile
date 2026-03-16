# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the csproj and restore dependencies
COPY ["TimetablesAPI.csproj", "./"]
RUN dotnet restore "TimetablesAPI.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build "TimetablesAPI.csproj" -c Release -o /app/build

# Publish stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy published app from build stage
COPY --from=build /app/build .

# Expose port (Render uses 10000)
EXPOSE 10000

# Set environment variables
ENV ASPNETCORE_URLS=http://+:10000
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "TimetablesAPI.dll"]