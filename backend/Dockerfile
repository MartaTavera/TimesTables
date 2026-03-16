# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the entire backend directory
COPY . .

# Restore dependencies
RUN dotnet restore

# Build the application
RUN dotnet build -c Release -o /app/build

# Publish stage - creates the runtime-ready files
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS publish
WORKDIR /src
COPY --from=build /src .
RUN dotnet publish -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copy published app
COPY --from=publish /app/publish .

# Expose port (Render uses 10000)
EXPOSE 10000

# Set environment variables
ENV ASPNETCORE_URLS=http://+:10000
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "TimetablesAPI.dll"]